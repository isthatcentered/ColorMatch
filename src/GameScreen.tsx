import { playing } from "./App"
import React from "react"




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
				
				<ColorBox color={`hsl(${currentHue}, 100%, 50%)`}/>
				
				<button className="w-full text-center text-white block p-4 capitalize font-bold text-4xl">
					Stop
				</button>
			</main>
		</div>)
}


export function ColorBox( { color }: { color: string } )
{
	return (
		<div
			className="h-full rounded-xl flex-grow"
			style={{ background: color, borderRadius: 20 }}
		/>)
}
