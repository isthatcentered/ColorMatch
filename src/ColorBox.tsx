import React, { HTMLAttributes } from "react"
import { Hue } from "./Hue"
import { useOscillator } from "./hooks"




export interface ColorBoxProps
{
	hue: Hue
}


export function ColorBox( { hue, className = "", style = {}, ...props }: ColorBoxProps & HTMLAttributes<HTMLDivElement> )
{
	return (
		<div
			{...props}
			className={className + ` h-full rounded-xl flex-grow`}
			style={{
				transition:   "all 0.2s ease",
				...style,
				background:   `hsl(${hue.value}, 100%, 50%)`,
				borderRadius: 20,
				
			}}
		/>)
}


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