import { useCallback, useLayoutEffect, useState } from "react"




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


export function useOscillator( { running, speed, defaultValue }: { running: boolean, speed: number, defaultValue: number } ): number
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