import { useCallback, useEffect, useState } from "react"




function useLoop( { running, callback }: { running: boolean, callback: () => void } ): void
{
	useEffect( () => {
		if ( !running )
			return
		
		let rafId: DOMHighResTimeStamp
		
		const loop = () => {
			rafId = window.requestAnimationFrame( loop )
			
			callback() // 🛑 for some reason the call order matters
		}
		
		loop()
		
		return () => window.cancelAnimationFrame( rafId )
	}, [ running, callback ] )
}


interface useOscillatorProps
{
	running: boolean,
	speed: number,
	defaultValue: number
	min: number
	max: number
}


export function useOscillator( { running, speed, defaultValue, min, max }: useOscillatorProps ): number
{
	const [ num, setNum ] = useState<number>( defaultValue ),
	      callback        = useCallback(
		      () =>
			      setNum( num =>
				      (num + speed) >= max ?
				      min :
				      num + speed ),
		      [ speed ],
	      ) // Maintains the id of the function to avoid useLoop identifying it as new function on every render
	
	useLoop( {
		running,
		callback,
	} )
	
	return num
}