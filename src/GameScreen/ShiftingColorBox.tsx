import React, { HTMLAttributes } from "react"
import { useOscillator } from "./hooks"
import { Hue } from "./ValueObjects"
import { ColorBox } from "./ColorBox"




export interface ShiftingColorBoxProps
{
	defaultHue: Hue
	
	onColorSubmit( hue: Hue ): any
	
	speed: number
}


export function ShiftingColorBox( { defaultHue, onColorSubmit, speed, style = {}, ...props }: ShiftingColorBoxProps & HTMLAttributes<HTMLButtonElement> )
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
		onColorSubmit( hue )
	}
	
	
	return (
		<button
			{...props}
			className={`cursor-pointer focus:border-blue-lighter border-4 border-transparent focus:outline-none overflow-hidden ${props.className || ""}`}
			onClick={handleClick}
			style={{
				...style,
				transition:   "width 0.2s ease",
				borderRadius: 25,
			}}
		
		>
			<ColorBox hue={hue}
			          className="h-full"
			/>
		</button>)
}