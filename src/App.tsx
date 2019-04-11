import React, { ReactElement } from "react"
import { HomeScreen } from "./HomeScreen"
import { GameOverScreen } from "./GameOverScreen"
import { GameScreen } from "./GameScreen"



// States are:
export type awaiting = {
	type: "awaiting"
}

export type playing = {
	type: "playing"
	currentHue: number,
	targetHue: number,
	life: number,
	level: number
}

export type defeated = {
	type: "defeated"
	level: number,
}

export type gameState = awaiting | playing | defeated

const getInitialState = (): gameState => ({
	type:       "playing",
	currentHue: 100,
	level:      1,
	life:       100,
	targetHue:  190,
})


export function App()
{
	// const state                   = getInitialState(),
	//       [ running, setRunning ] = useState<boolean>( true ),
	//       hue                     = 360 * useOscillator( { running, defaultValue: Math.random(), speed: .002 } )
	
	const state = getInitialState()
	
	return (
		<div className="App">
			{((): ReactElement => {
				switch ( state.type ) {
					case "awaiting":
						return <HomeScreen/>
					
					case "playing":
						return <GameScreen state={state}/>
					
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



