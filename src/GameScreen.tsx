import { playing } from "./App"
import React, { HTMLAttributes } from "react"
import { useOscillator } from "./hooks"




interface GameScreenProps
{
	state: playing
}


export function GameScreen( { state: { targetHue, currentHue, level } }: GameScreenProps )
{
	return (
		<div className="text-white h-screen flex flex-col">
			<header className="flex items-center p-4">
				<h1 className="text-4xl font-bold">Color match!</h1>
				<p className="ml-auto text-4xl font-bold">Level {level}</p>
			</header>
			<main className="text-center flex-grow flex flex-col px-2">
				
				<ColorBox color={`hsl(${targetHue}, 100%, 50%)`}/>
				
				<div className="pt-2"/>
				
				<ShiftingColorBox defaultHue={currentHue} className="cursor-pointer"/>
				
				<button className="w-full text-center text-white block p-4 capitalize font-bold text-4xl">
					Stop
				</button>
			</main>
		</div>)
}


interface ColorBoxProps
{
	color: string
}


export function ColorBox( { color, className = "", style = {}, ...props }: ColorBoxProps & HTMLAttributes<HTMLDivElement> )
{
	return (
		<div
			{...props}
			className={className + ` h-full rounded-xl flex-grow`}
			style={{ background: color, borderRadius: 20, ...style }}
		/>)
}


interface ShiftingColorBoxProps
{
	defaultHue: number
}


export function ShiftingColorBox( { defaultHue, ...props }: ShiftingColorBoxProps & HTMLAttributes<HTMLDivElement> )
{
	const hue = 360 * useOscillator( { running: true, defaultValue: (defaultHue / 360), speed: .002 } )
	
	return <ColorBox {...props} color={`hsl(${hue}, 100%, 50%)`}/>
}


