import React, { HTMLAttributes } from "react"
import { Hue } from "./ValueObjects"




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


