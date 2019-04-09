import React, { useState } from "react"
import { useOscillator } from "./hooks"




const getInitialState = () => ({
	// runOsc:  true, // runOsc & playing are duplicates, osc only runs if game runs
	// playing: false, // runOsc & playing are duplicates, osc only runs if game runs
	// speed:    0.003, // Speed could be infered by: mode [noob, hardcore, the rock]
	// life:     0,
	// level:    1,
	// oscStart: Math.random(),
	// target:   Math.random(),
});

// States are:
type awaiting = {}

type playing = {
	// mode: "noob" | "ok" | "hardcore" | "the Rock" // mode selector is for later
	currentHue: number,
	targetHue: number,
	life: number,
	level: number
}

type defeated = {
	level: number,
	// mode: "noob" | "ok" | "hardcore" | "the Rock" // (maybe if i add it)
}

type gameState = awaiting | playing | defeated


export function App()
{
	const [ running, setRunning ] = useState<boolean>( true ),
	      hue                     = 360 * useOscillator( { running, defaultValue: Math.random(), speed: .002 } )
	
	return (
		<div className="App">
			
			<div style={{ padding: 10 }}>
				<button onClick={() => setRunning( running => !running )}>
					{running ?
					 "stop" :
					 "start"}
				</button>
				{" "} {hue}
			</div>
			
			<ColorBox color={`hsl(${hue}, 100%, 50%)`}/>
		</div>
	)
}


function ColorBox( { color }: { color: string } )
{
	return <div style={{ background: color, width: "100vw", height: "100vh" }}/>
}

