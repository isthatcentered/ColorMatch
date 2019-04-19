import React, { Component, HTMLAttributes, ReactElement, ReactNode } from "react"
import { ColorBox } from "./ColorBox"
import { Link, RouteComponentProps } from "@reach/router"
import { Hue, Level, Life } from "./ValueObjects"
import { ColorMAtchGameAction } from "./Actions"
import { useSeconds } from "./hooks"
import { ShiftingColorBox, ShiftingColorBoxProps } from "./ShiftingColorBox"
import { Flash } from "./Flash"
import { ColorMatchStateHandler, StartingNewLevelState } from "./GameBehaviors"




/**
 * ✅ Fix "play again" button on game over screen
 * ✅ Show a white flash on life lost
 * ✅ Dispatch a "tick" action on every tick
 * ✅ 1 point of life is lost on every tick
 * ✅ 1 point of life is lost on every second (aka if x ticks have passed)
 * ✅ 1 point of life is lost on every second only if time since last submit > 5s
 * ✅ 1 point of life is lost on every second only if time since last submit > 5s && wheel had time to revolve
 * ✅ Get rid of statHandler.render() -> cannot [this.handleEvent not defined]
 * ✅ Display death level in game over screen
 * ✅ Control via keyboard
 * 🛑 Create shell component
 * 🛑 Use state reducer to control the views
 * 🛑 Hit flashes as event subscribtion
 * 🛑 Victory feedback as event subscribtion
 * 🛑 Add victory streak
 * 🛑 Victory indicator
 * 🛑 Show some kind of "safe" time bar that decreases
 * 🛑 If you make >= 99% match in survival mode, you get back the points you lost in survival mode + a bonus
 * 🛑 Transform hardoced actions into returntype<makeXAction>
 * 🛑 Can you move computations to a service worker (clearly not worth it but intersting)
 * 🛑 Life system refactor
 */

export const getInitialState = (): ColorMatchViewModel => {
	return {
		currentHue: Hue.random(),
		level:      new Level( { stage: 1, speed: .8 } ),
		life:       new Life( 100 ),
		targetHue:  Hue.random(),
	}
}

export type ColorMatchViewModel = {
	currentHue: Hue,
	targetHue: Hue,
	life: Life,
	level: Level
}

export class GameScreen extends Component<{} & RouteComponentProps>
{
	private _stateHandler: ColorMatchStateHandler = new StartingNewLevelState( getInitialState() )
	
	state = this._stateHandler.render()
	
	dispatch = ( event: ColorMAtchGameAction ) => {
		this._stateHandler = this._stateHandler.handleEvent( event )
		
		this.setState( this._stateHandler.render() )
	}
	
	
	render()
	{
		return <GameScreenView dispatch={this.dispatch.bind( this )} {...this.state}/>
	}
}


export interface GameScreenViewProps extends ColorMatchViewModel
{
	dispatch: ( event: ColorMAtchGameAction ) => void
}


export function GameScreenView( { life, targetHue, currentHue, level, dispatch }: GameScreenViewProps )
{
	const handleClickColor: ShiftingColorBoxProps["onColorSubmit"] = ( hue ) => dispatch( { type: "SUBMIT", payload: hue } ),
	      isGameOver: boolean                                      = life.value <= 0
	
	useSeconds( () => {
		dispatch( { type: "TICK" } )
	}, [ life, dispatch ] )
	
	return (
		<Shell level={level}
		       playing={!isGameOver}
		       action={
			       isGameOver ?
			       <button onClick={() => dispatch( { type: "RESTART" } )}
			               className="w-full text-center text-white block p-4 capitalize font-bold text-4xl"
			               style={{ backgroundColor: "#55dd44" }}
			       >
				       Play again
			       </button> :
			       <Link
				       to={"/"}
				       className="w-full text-center text-white block p-4 capitalize font-bold text-4xl">
				       Stop
			       </Link>
		       }>
			{isGameOver ?
			 <div className="flex-grow flex flex-col justify-center">
				 <h2 className="uppercase px-4 py-4"
				     style={{ fontSize: 80 }}>
					 Game Over
				 </h2>
				 <p className="text-4xl font-bold">You got to level {level.toString()}!</p>
			 </div> :
			 <>
				 {life.value < 100 &&
				 <Flash
					 key={life.value}
					 style={{
						 zIndex: -1, background: `hsl(${targetHue.value}, 100%, 50%)`,
					 }}
				 />}
				
				 <ColorBox
					 className="h-full flex-grow fade-in-scale-x"
					 hue={targetHue}
					 style={{ width: `${life.value}%` }}
				 />
				
				
				 <div className="pt-2"/>
				
				 <ShiftingColorBox
					 defaultHue={currentHue}
					 speed={level.speed}
					 onColorSubmit={handleClickColor}
					 style={{ width: `${life.value}%` }}
					 className="h-full flex-grow fade-in-scale-x"
				 />
			 </>
			}
		</Shell>)
}


function Shell( { action, level, children, playing }: { action: ReactElement, level: Level, children: ReactNode, playing: boolean } )
{
	const colors = playing ?
	               { header: "transparent", footer: "transparent" } :
	               { header: "#ff0044", footer: "#55dd44" }
	
	return (
		<div className="text-white h-screen flex flex-col">
			<Header level={level}
			        style={{ background: colors.header }}/>
			
			<main className="text-center flex-grow flex flex-col items-center px-2">
				{children}
			</main>
			
			<Footer style={{ background: colors.footer }}>
				{action}
			</Footer>
		</div>)
}


function Header( { level, className = "", ...props }: { level: Level } & HTMLAttributes<HTMLDivElement> )
{
	return (
		<header {...props} className={`flex items-center p-4 transition ${className}`}>
			<h1 className="text-4xl font-bold">Color match!</h1>
			<p className="ml-auto text-4xl font-bold">Level {level.toString()}</p>
		</header>)
}


function Footer( { children, className = "", ...props }: { children: ReactElement, } & HTMLAttributes<HTMLDivElement> )
{
	return (
		<div {...props} className={`w-full block transition ${className}`}>
			{children}
		</div>)
}