import React, { ReactElement } from "react"
import { HomeScreen } from "./HomeScreen"
import { GameOverScreen } from "./GameOverScreen"



// States are:
export type awaiting = {
	state: "awaiting"
}

export type playing = {
	state: "playing"
	currentHue: number,
	targetHue: number,
	life: number,
	level: number
}

export type defeated = {
	state: "defeated"
	level: number,
}

export type gameState = awaiting | playing | defeated

const getInitialState = (): gameState => ({ state: "defeated", level: 6 })


export function App()
{
	// const state                   = getInitialState(),
	//       [ running, setRunning ] = useState<boolean>( true ),
	//       hue                     = 360 * useOscillator( { running, defaultValue: Math.random(), speed: .002 } )
	
	const { state, ...data } = getInitialState()
	
	return (
		<div className="App">
			
			{((): ReactElement => {
				switch ( state ) {
					case "awaiting":
						return <HomeScreen/>
					
					case "playing":
						return <div/>
					
					case "defeated":
						return <GameOverScreen  />
					
					default:
						const shouldNotBeReached: never = state
						return <div/>
				}
			})()}
			
			{/*<div style={{ padding: 10 }}>*/}
			{/*<button onClick={() => setRunning( running => !running )}>*/}
			{/*{running ?*/}
			{/*"stop" :*/}
			{/*"start"}*/}
			{/*</button>*/}
			{/*{" "} {hue}*/}
			{/*</div>*/}
			{/**/}
			{/*<ColorBox color={`hsl(${hue}, 100%, 50%)`}/>*/}
		</div>
	)
}


function ColorBox( { color }: { color: string } )
{
	return <div style={{ background: color, width: "100vw", height: "100vh" }}/>
}

