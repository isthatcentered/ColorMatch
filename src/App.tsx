import React, { useLayoutEffect, useState } from "react"




function ColorBox( { color }: { color: string } )
{
	return <div style={{ backgroundColor: color, width: "100vw", height: "100vh" }}/>
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
	}, [ running, id ] )
}


export function App()
{
	
	const [ running, setRunning ] = useState<boolean>( false ),
	      [ num, setNum ]         = useState<number>( 0 )
	
	useLoop( {
		running,
		callback: () => {
			setNum( num + 1 )
		},
	} )
	
	return (
		<div className="App">
			
			<div style={{ padding: 10 }}>
				<button onClick={() => setRunning( running => !running )}>
					{running ?
					 "stop" :
					 "start"}
				</button>
				{" "} {num}
			</div>
			
			<ColorBox color={`hsl(${360 * .003}, 100%, 50%)`}/>
		</div>
	)
}

