import { gameActions } from "./types"
import React, { Reducer, useReducer } from "react"
import { ColorBox, ShiftingColorBox, ShiftingColorBoxProps } from "./ColorBox"
import { Link, RouteComponentProps } from "@reach/router"
import { GameOverScreen } from "./GameOverScreen"
import { Hue } from "./Hue"
import { Level, Life, Points } from "./ValueObjects"




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

type ColorMatchGameStates = playing | survival | defeated



const getInitialState = (): playing => {
	return {
		type:       "playing",
		currentHue: Hue.random(),
		level:      new Level( { stage: 1, speed: .8 } ),
		life:       new Life( 100 ),
		targetHue:  Hue.random(),
	}
}

/**
 * 🛑 Fix "play again" button on game over screen
 * 🛑 Show a white flash on life lost
 * 🛑 Dispatch a "tick" action on every tick
 * 🛑 1 point of life is lost on every tick
 * 🛑 1 point of life is lost on every second (aka if x ticks have passed)
 * 🛑 1 point of life is lost on every second only if wheel had time to revolve
 * 🛑 Show some kind of "safe" time left
 * 🛑 Show a white shrine on life lost (key=life)
 */
const appReducer: Reducer<playing, gameActions> = function ( state, action ): playing {
	console.log( state.type, action.type, state, action )
	
	switch ( state.type ) {
		case "playing":
			switch ( action.type ) {
				case "ColorSubmittedAction":
					try {
						const life = state.life.take( Points.for( state.targetHue, action.payload ) )
						
						return {
							...state,
							life,
							targetHue: Hue.random(),
							level:     state.level.next(), // you didn't die, you get to go to the next level
						}
					} catch ( e ) {
						return {
							...state,
							life: new Life( 0 ),
						}
						// redirect
						//return { type: "defeated", level: state.level }
					}
			}
			return { ...state }
	}
	
	return state
}


interface GameScreenProps extends RouteComponentProps
{
}


export function GameScreen( {}: GameScreenProps )
{
	
	const [ { life, targetHue, currentHue, level }, dispatch ] = useReducer( appReducer, getInitialState() )
	
	const handleClickColor: ShiftingColorBoxProps["onColorClick"] = ( hue ) =>
		dispatch( { type: "ColorSubmittedAction", payload: hue } )
	
	return life.value ?
	       (
		       <div className="text-white h-screen flex flex-col">
			       <header className="flex items-center p-4">
				       <h1 className="text-4xl font-bold">Color match!</h1>
				       <p className="ml-auto text-4xl font-bold">Level {level.toString()}</p>
			       </header>
			
			       <main className="text-center flex-grow flex flex-col items-center px-2">
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
	       <GameOverScreen/>
}


