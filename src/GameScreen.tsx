import React, { HTMLAttributes, Reducer, useEffect, useReducer } from "react"
import { ColorBox, ShiftingColorBox, ShiftingColorBoxProps } from "./ColorBox"
import { Link, RouteComponentProps } from "@reach/router"
import { GameOverScreen } from "./GameOverScreen"
import { Hue } from "./Hue"
import { Level, Life, Points } from "./ValueObjects"
import { ColorMAtchGameActions } from "./types"




type playing = {
	type: "playing"
	currentHue: Hue,
	targetHue: Hue,
	life: Life,
	level: Level
}
type survival = {
	type: "survival"
} & playing

type defeated = {
	type: "defeated"
}

type ColorMatchGameStates = {
	currentHue: Hue,
	targetHue: Hue,
	life: Life,
	level: Level
	ticksSinceLastSubmit: number,
	status: "hit" | "victorious" | "idle",
	__handler: ColorMatchStateHandler
}



const getInitialState = (): ColorMatchGameStates => {
	return {
		currentHue:           Hue.random(),
		level:                new Level( { stage: 1, speed: .8 } ),
		life:                 new Life( 100 ),
		targetHue:            Hue.random(),
		ticksSinceLastSubmit: 0,
		status:               "idle", // @todo: should this be a computed thing, return previous life and let components decide ?
		__handler:            new StartingState(),
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
 * 🛑 Show some kind of "safe" time bar that decreases
 * 🛑 Transform hardoced actions into returntype<makeXAction>
 * 🛑 Transitions
 */

interface ColorMatchStateHandler
{
	handleEvent( state: ColorMatchGameStates, event: ColorMAtchGameActions ): ColorMatchGameStates
}


class StartingState implements ColorMatchStateHandler
{
	handleEvent( state: ColorMatchGameStates, event: ColorMAtchGameActions ): ColorMatchGameStates
	{
		switch ( event.type ) {
			case "SUBMIT":
				try {
					const life = state.life.take( Points.for( state.targetHue, event.payload ) )
					
					return {
						...state,
						life,
						ticksSinceLastSubmit: 0,
						targetHue:            Hue.random(),
						level:                state.level.next(), // you didn't die, you get to go to the next level
						status:               life.value < state.life.value ?
						                      "hit" :
						                      "victorious",
					}
				} catch ( e ) {
					return {
						...state,
						life: new Life( 0 ),
					}
					// redirect
				}
			case "TICK":
				const { ticksSinceLastSubmit, level, life } = state,
				      fiveSecondsHavePassed                 = ticksSinceLastSubmit >= 4,
				      timeRequiredToReveolveWheel           = (Hue.MAX / level.speed) / 60,
				      shouldLooseLife                       = ticksSinceLastSubmit >= timeRequiredToReveolveWheel && fiveSecondsHavePassed
				
				return {
					...state,
					ticksSinceLastSubmit: ticksSinceLastSubmit + 1,
					life:                 shouldLooseLife ?
					                      new Life( life.value - 1 ) : // @todo: this is dirty, I shoud be able to subtract points or something
					                      life,
				}
			
			case "RESTART":
				return getInitialState()
			
			default:
				ensureAllCasesHandled( event )
		}
		
		
		return state
	}
}

const appReducer: Reducer<ColorMatchGameStates, ColorMAtchGameActions> = ( state, action ) => {
	
	return state.__handler.handleEvent( state, action )
}


function useSeconds( callback: () => void, deps: any[] )
{
	useEffect( () => {
		const _id = setInterval( _ => callback(), 1000 )
		
		return () => clearInterval( _id )
	}, deps )
}


export function GameScreen( props: {} & RouteComponentProps )
{
	const [ { life, targetHue, currentHue, level, status }, dispatch ] = useReducer( appReducer, getInitialState() )
	
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
				
				       {life.value < 100 && <Flash key={life.value}
				                                   style={{ zIndex: -1 }}/>}
				
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
