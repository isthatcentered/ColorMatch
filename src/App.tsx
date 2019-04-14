import React, { Reducer, useReducer } from "react"
import { HomeScreen } from "./HomeScreen"
import { GameScreen } from "./GameScreen"
import { gameActions, gameState, playing } from "./types"
import { Hue } from "./Hue"
import { Level, Life, Points } from "./ValueObjects"
import { Router } from "@reach/router"




const getInitialState = (): gameState => {
	return {
		type:       "playing",
		currentHue: Hue.random(),
		level:      new Level( { stage: 1, speed: .8 } ),
		life:       new Life( 100 ),
		targetHue:  Hue.random(),
	}
}

/**
 * 🛑 Show a white flash on life lost
 * 🛑 Dispatch a "tick" action on every tick
 * 🛑 1 point of life is lost on every tick
 * 🛑 1 point of life is lost on every second (aka if x ticks have passed)
 * 🛑 1 point of life is lost on every second only if wheel had time to revolve
 * 🛑 Show some kind of "safe" time left
 * 🛑 Show a white shrine on life lost (key=life)
 */
const appReducer: Reducer<gameState, gameActions> = function ( state, action ): gameState {
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


export function App()
{
	const [ state, dispatch ] = useReducer( appReducer, getInitialState() )
	return (
		<div className="App">
			<Router>
				<HomeScreen path={"/"}/>
				
				<GameScreen path={"/game"}
				            dispatch={dispatch}
				            state={state}/>
			</Router>
		</div>
	)
}



