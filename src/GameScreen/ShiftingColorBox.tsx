import React, { HTMLAttributes } from "react"
import { useOscillator } from "./hooks"
import { Hue } from "./ValueObjects"
import { ColorBox } from "./ColorBox"




export interface ShiftingColorBoxProps
{
	defaultHue: Hue
	
	onColorClick( hue: Hue ): any
	
	speed: number
}


export function ShiftingColorBox( { defaultHue, onColorClick, speed, ...props }: ShiftingColorBoxProps & HTMLAttributes<HTMLDivElement> )
{
	const value = useOscillator( {
		      speed:        speed,
		      min:          Hue.MIN,
		      max:          Hue.MAX,
		      running:      true,
		      defaultValue: defaultHue.value,
	      } ),
	      hue   = Hue.from( value )
	
	
	function handleClick()
	{
		onColorClick( hue )
	}
	
	
	return <ColorBox {...props} hue={hue}
	                 onClick={handleClick}/>
}