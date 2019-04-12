import React, { ReactElement, Reducer, useReducer } from "react"
import { HomeScreen } from "./HomeScreen"
import { GameOverScreen } from "./GameOverScreen"
import { GameScreen } from "./GameScreen"
import { gameActions, gameState, playing } from "./types"
import { Hue } from "./Hue"
import { Brand } from "utility-types"




const getInitialState = (): gameState => ({
	type:       "playing",
	currentHue: Hue.random(),
	level:      0,
	life:       0,
	targetHue:  Hue.random(),
})


const appReducer: Reducer<gameState, gameActions> = function ( state, action ): gameState {
	switch ( state.type ) {
		case "awaiting":
			
			return { ...state }
		
		case "playing":
			switch ( action.type ) {
				case "ColorSubmittedAction":
					console.log( Score.for( state.targetHue, action.payload ) )
					return { ...state }
				
				case "QuitAction":
					return { ...state }
				
				default:
					const shouldNeverBeReached: never = action
					break;
			}
			return { ...state }
		
		case "defeated":
			
			return { ...state }
		
		default:
			const shouldNeverBeReached: never = state
			break;
	}
	
	return state
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



type score = Brand<number, "score">

class Score
{
	static for( target: Hue, actual: Hue ): score
	{
		return actual.shortestDistanceTo( target ) as score
	}
}