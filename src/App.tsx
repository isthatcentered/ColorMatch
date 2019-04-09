import React, { useCallback, useLayoutEffect, useState } from "react"




function ColorBox( { color }: { color: string } )
{
	return <div style={{ background: color, width: "100vw", height: "100vh" }}/>
}


function useLoop( { running, callback }: { running: boolean, callback: () => void } ): void
{
	const [ id, setId ] = useState<DOMHighResTimeStamp>( 0 )
	
	useLayoutEffect( () => {
		if ( !running )
			return
		
		const _nextId: DOMHighResTimeStamp = window.requestAnimationFrame( () => {
			callback()
			
			setId( _nextId )
		} )
		
		return () => window.cancelAnimationFrame( id || 0 )
	}, [ running, id, callback ] )
}


function useOscillator( { running, speed, defaultValue }: { running: boolean, speed: number, defaultValue: number } ): number
{
	const [ num, setNum ] = useState<number>( defaultValue ),
	      callback        = useCallback(
		      () =>
			      setNum( num =>
				      num >= 1 ?
				      0 :
				      num + speed ),
		      [ speed ],
	      ) // Maintains the id of the function to avoid useLoop identifying it as new function on every render
	
	useLoop( {
		running,
		callback,
	} )
	
	return num
}


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

