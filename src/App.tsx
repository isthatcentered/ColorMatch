import React, { ReactElement, Reducer, useReducer } from "react"
import { HomeScreen } from "./HomeScreen"
import { GameOverScreen } from "./GameOverScreen"
import { GameScreen } from "./GameScreen"
import { gameActions, gameState, playing } from "./types"
import { Hue } from "./Hue"
import { Level, Life, Points } from "./ValueObjects"




const getInitialState = (): gameState => ({ type: "awaiting" })


function getStartingPlayingState(): playing
{
	return {
		type:       "playing",
		currentHue: Hue.random(),
		level:      new Level( { stage: 1, speed: .8 } ),
		life:       new Life( 100 ),
		targetHue:  Hue.random(),
	}
}


const appReducer: Reducer<gameState, gameActions> = function ( state, action ): gameState {
	console.log( state.type, action.type, state, action )
	switch ( state.type ) {
		case "awaiting":
			switch ( action.type ) {
				case "ColorSubmittedAction":
				case "QuitGameAction":
				case "StartGameAction":
					return { ...getStartingPlayingState() }
				
				default:
					const shouldNeverBeReached: never = action
					break;
			}
			return { ...state }
		
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
						
						return { type: "defeated", level: state.level }
					}
				
				
				case "QuitGameAction":
					return {
						type: "awaiting",
					}
				
				case "StartGameAction":
					return { ...state }
				
				default:
					const shouldNeverBeReached: never = action
					break;
			}
			return { ...state }
		
		case "defeated":
			switch ( action.type ) {
				case "ColorSubmittedAction":
				case "QuitGameAction":
				case "StartGameAction":
					return { type: "playing", ...getStartingPlayingState() }
				
				default:
					const shouldNeverBeReached: never = action
					break;
			}
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
						return <HomeScreen dispatch={dispatch}/>
					
					case "playing":
						return <GameScreen dispatch={dispatch}
						                   state={state}/>
					
					case "defeated":
						return <GameOverScreen dispatch={dispatch}
						                       state={state}/>
					
					default:
						const shouldNotBeReached: never = state
						return <div/>
				}
			})()}
		</div>
	)
}



