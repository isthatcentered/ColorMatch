import React, { ReactElement, Reducer, useReducer } from "react"
import { HomeScreen } from "./HomeScreen"
import { GameOverScreen } from "./GameOverScreen"
import { GameScreen } from "./GameScreen"
import { gameActions, gameState } from "./types"




const getInitialState = (): gameState => ({ type: "playing", currentHue: Math.random() * 360, level: 0, life: 0, targetHue: Math.random() * 360 })

const appReducer: Reducer<gameState, gameActions> = function ( state, action ): gameState {
	console.log( state, action )
	return { ...state }
}


export function App()
{
	const [ state, dispatch ] = useReducer( appReducer, getInitialState() )
	
	return (
		<div className="App">
			{((): ReactElement => {
				switch ( state.type ) {
					case "awaiting":
						return <HomeScreen/>
					
					case "playing":
						return <GameScreen dispatch={dispatch}
						                   state={state}/>
					
					case "defeated":
						return <GameOverScreen state={state}/>
					
					default:
						const shouldNotBeReached: never = state
						return <div/>
				}
			})()}
		</div>
	)
}



