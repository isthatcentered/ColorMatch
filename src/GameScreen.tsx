import { gameActions, playing } from "./types"
import React, { HTMLAttributes } from "react"
import { useOscillator } from "./hooks"
import { Hue } from "./Hue"




interface GameScreenProps
{
	state: playing
	
	dispatch( action: gameActions ): void
}


export function GameScreen( { state: { targetHue, currentHue, level }, dispatch }: GameScreenProps )
{
	const handleClickColor: ShiftingColorBoxProps["onColorClick"] = ( hue ) =>
		dispatch( { type: "ColorSubmittedAction", payload: hue } )
	
	
	return (
		<div className="text-white h-screen flex flex-col">
			<header className="flex items-center p-4">
				<h1 className="text-4xl font-bold">Color match!</h1>
				<p className="ml-auto text-4xl font-bold">Level {level}</p>
			</header>
			<main className="text-center flex-grow flex flex-col px-2">
				
				<ColorBox hue={targetHue}/>
				
				<div className="pt-2"/>
				
				<ShiftingColorBox defaultHue={currentHue}
				                  onColorClick={handleClickColor}
				                  className="cursor-pointer"/>
				
				<button className="w-full text-center text-white block p-4 capitalize font-bold text-4xl">
					Stop
				</button>
			</main>
		</div>)
}


interface ColorBoxProps
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


interface ShiftingColorBoxProps
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


