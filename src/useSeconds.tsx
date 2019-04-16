import { useEffect } from "react"




export function useSeconds( callback: () => void, deps: any[] )
{
	useEffect( () => {
		const _id = setInterval( _ => callback(), 1000 )
		
		return () => clearInterval( _id )
	}, deps )
}