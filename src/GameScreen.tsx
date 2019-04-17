import React, { Component, HTMLAttributes } from "react"
import { ColorBox, ShiftingColorBox, ShiftingColorBoxProps } from "./ColorBox"
import { Link, RouteComponentProps } from "@reach/router"
import { GameOverScreen } from "./GameOverScreen"
import { Hue } from "./Hue"
import { Level, Life, Points } from "./ValueObjects"
import { ColorMAtchGameActions } from "./types"
import { useSeconds } from "./useSeconds"




type ColorMatchGameStates = {
	currentHue: Hue,
	targetHue: Hue,
	life: Life,
	level: Level
}



const getInitialState = (): ColorMatchGameStates => {
	return {
		currentHue: Hue.random(),
		level:      new Level( { stage: 1, speed: .8 } ),
		life:       new Life( 100 ),
		targetHue:  Hue.random(),
	}
}

/**
 * ✅ Fix "play again" button on game over screen
 * ✅ Show a white flash on life lost
 * ✅ Dispatch a "tick" action on every tick
 * ✅ 1 point of life is lost on every tick
 * ✅ 1 point of life is lost on every second (aka if x ticks have passed)
 * ✅ 1 point of life is lost on every second only if time since last submit > 5s
 * ✅ 1 point of life is lost on every second only if time since last submit > 5s && wheel had time to revolve
 * 🛑 Get rid of statHandler.render()
 * 🛑 Transitions
 * 🛑 Show some kind of "safe" time bar that decreases
 * 🛑 If you make >= 99% match in survival mode, you get back the points you lost in survival mode + a bonus
 * 🛑 Transform hardoced actions into returntype<makeXAction>
 */
interface ColorMatchStateHandler extends ColorMatchGameStates
{
	handleEvent( event: ColorMAtchGameActions ): ColorMatchStateHandler
	
	render(): ColorMatchGameStates
}

class StartingNewLevelState implements ColorMatchStateHandler
{
	private _ticksSinceLastSubmit: number = 0
	
	currentHue: Hue
	level: Level
	life: Life
	targetHue: Hue
	
	
	constructor( { currentHue, level, life, targetHue }: ColorMatchGameStates )
	{
		this.currentHue = currentHue
		this.level = level
		this.life = life
		this.targetHue = targetHue
	}
	
	
	handleEvent( event: ColorMAtchGameActions ): ColorMatchStateHandler
	{
		switch ( event.type ) {
			case "TICK":
				this._ticksSinceLastSubmit++
				
				const shoulgGoIntoSurvivalMode = this._haveNthSecondsPassed( 4 ) &&
					this._hadTimeToRevolveHueWheel( this.level.speed )
				
				return shoulgGoIntoSurvivalMode ?
				       new SurvivalState( this ) :
				       this
			
			case "SUBMIT":
				try {
					this.life = this.life.take( Points.for( this.targetHue, event.payload ) )
					this.targetHue = Hue.random()
					this.level = this.level.next() // you didn't die, you get to go to the next level
					
					return new StartingNewLevelState( this )
				} catch ( e ) {
					this.life = new Life( 0 )
					return new GameOverState( this )
				}
			
			case "RESTART":
				return new StartingNewLevelState( getInitialState() )
			
			default:
				ensureAllCasesHandled( event )
		}
		
		return this
	}
	
	
	render(): ColorMatchGameStates
	{
		return {
			currentHue: this.currentHue,
			level:      this.level,
			life:       this.life,
			targetHue:  this.targetHue,
		}
	}
	
	
	private _haveNthSecondsPassed = ( seconds: number ): boolean => {
		return this._ticksSinceLastSubmit >= seconds
	}
	
	
	private _hadTimeToRevolveHueWheel = ( rotationSpeed: number ): boolean => {
		const timeRequiredToRevolve = (Hue.MAX / rotationSpeed) / 60
		return this._ticksSinceLastSubmit >= timeRequiredToRevolve
	}
	
}

class SurvivalState extends StartingNewLevelState
{
	handleEvent( event: ColorMAtchGameActions ): ColorMatchStateHandler
	{
		switch ( event.type ) {
			case "TICK":
				try {
					this.life = new Life( this.life.value - 1 )
					return this
				} catch ( e ) {
					this.life = new Life( 0 )
					return new GameOverState( this )
				}
			
			case "SUBMIT":
				return super.handleEvent( event )
			
			case "RESTART":
				return super.handleEvent( event )
			
			default:
				ensureAllCasesHandled( event )
		}
		
		return super.handleEvent( event )
	}
}

class GameOverState extends StartingNewLevelState
{
	handleEvent( event: ColorMAtchGameActions ): ColorMatchStateHandler
	{
		switch ( event.type ) {
			
			case "TICK":
				return this
			case "SUBMIT":
				return this
			
			case "RESTART":
				return super.handleEvent( event )
			
			default:
				ensureAllCasesHandled( event )
		}
		
		return super.handleEvent( event )
	}
}


export class GameScreen extends Component<{} & RouteComponentProps>
{
	private _stateHandler: ColorMatchStateHandler = new StartingNewLevelState( getInitialState() )
	
	state = this._stateHandler.render()
	
	dispatch = ( event: ColorMAtchGameActions ) => {
		this._stateHandler = this._stateHandler.handleEvent( event )
		
		this.setState( this._stateHandler.render() )
	}
	
	
	render()
	{
		return <GameScreenView dispatch={this.dispatch.bind( this )} {...this.state}/>
	}
}



export interface GameScreenViewProps extends ColorMatchGameStates
{
	dispatch: ( event: ColorMAtchGameActions ) => void
}


export function GameScreenView( { life, targetHue, currentHue, level, dispatch }: GameScreenViewProps )
{
	const handleClickColor: ShiftingColorBoxProps["onColorClick"] = ( hue ) =>
		dispatch( { type: "SUBMIT", payload: hue } )
	
	useSeconds( () => {
		dispatch( { type: "TICK" } )
	}, [ life, dispatch ] )
	
	return life.value ?
	       (
		       <div className="text-white h-screen flex flex-col">
			       <header className="flex items-center p-4">
				       <h1 className="text-4xl font-bold">Color match!</h1>
				       <p className="ml-auto text-4xl font-bold">Level {level.toString()}</p>
			       </header>
			
			       <main className="text-center flex-grow flex flex-col items-center px-2">
				
				       {life.value < 100 &&
				       <Flash
					       key={life.value}
					       style={{
						       zIndex: -1, background: `hsl(${targetHue.value}, 100%, 50%)`,
					       }}
				       />}
				
				       <ColorBox
					       hue={targetHue}
					       style={{ width: `${life.value}%` }}
				       />
				
				       <div className="pt-2"/>
				
				       <ShiftingColorBox
					       defaultHue={currentHue}
					       speed={level.speed}
					       onColorClick={handleClickColor}
					       className="cursor-pointer"
					       style={{ width: `${life.value}%` }}
				       />
				
				       <Link to={"/"}
				             className="w-full text-center text-white block p-4 capitalize font-bold text-4xl">
					       Stop
				       </Link>
			       </main>
		       </div>) :
	       <GameOverScreen dispatch={dispatch}/>
}


function Flash( props: HTMLAttributes<HTMLDivElement> )
{
	return (<div {...props} className={`Flash absolute w-full h-full pin pin-top pin-left bg-white pointer-events-none ${props.className}`}/>)
}


function ensureAllCasesHandled( switchedUpon: never )
{
	throw new Error( `Switch case not handled` )
}
