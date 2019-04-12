import React, { ReactElement, Reducer, useReducer } from "react"
import { HomeScreen } from "./HomeScreen"
import { GameOverScreen } from "./GameOverScreen"
import { GameScreen } from "./GameScreen"
import { gameActions, gameState, playing } from "./types"
import { Hue } from "./Hue"
import { Brand } from "utility-types"




const getInitialState = (): gameState => ({ type: "awaiting" })


function getStartingPlayingState(): playing
{
	return {
		type:       "playing",
		currentHue: Hue.random(),
		level:      new Level( { stage: 1, speed: .8 } ),
		life:       100,
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
					const points = ScorePoints.given( state.targetHue, action.payload ),
					      life   = Math.min( Math.max( 0, state.life + points ), 100 ) // Math.max 'cause score can be negative
					
					if ( !life )
						return { type: "defeated", level: state.level }
					
					return {
						...state,
						life,
						targetHue: Hue.random(),
						level:     state.level.next(), // you didn't die, you get to go to the next level
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



type score = Brand<number, "score">

export class ScorePoints
{
	static given( target: Hue, actual: Hue ): score
	{
		const missedTargetBy   = actual.shortestDistanceTo( target ),
		      huePoints        = Hue.MAX - missedTargetBy, // given target 50 & actual 49 -> 359
		      percentagePoints = Math.floor( huePoints * (100 / 360) )
		
		if ( percentagePoints >= 100 )
			return 10 as score
		
		else if ( percentagePoints >= 99 )
			return 5 as score
		else
			return -(100 - percentagePoints) as score
	}
}

export class Level
{
	private __stage: number
	private __speed: number
	
	
	constructor( { stage, speed }: { stage: number, speed: number } )
	{
		this.__stage = stage
		this.__speed = speed
	}
	
	
	next(): Level
	{
		return new Level( { stage: this.__stage + 1, speed: this.__speed * 1.25 } )
	}
	
	
	toString(): string
	{
		return this.__stage.toString()
	}
	
	
	get speed(): number
	{
		return this.__speed
	}
}