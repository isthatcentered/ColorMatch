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
			style={{ background: `hsl(${hue.value}, 100%, 50%)`, borderRadius: 20, ...style }}
		/>)
}


export interface ShiftingColorBoxProps
{
	defaultHue: Hue
	
	onColorClick( hue: Hue ): any
}


export function ShiftingColorBox( { defaultHue, onColorClick, ...props }: ShiftingColorBoxProps & HTMLAttributes<HTMLDivElement> )
{
	const value = useOscillator( { running: true, defaultValue: (defaultHue.value / Hue.MAX), speed: .002 } ),
	      hue   = Hue.from( value * Hue.MAX )
	
	
	function handleClick()
	{
		onColorClick( hue )
	}
	
	
	return <ColorBox {...props} hue={hue}
	                 onClick={handleClick}/>
}