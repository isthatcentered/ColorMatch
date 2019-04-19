import { ColorMAtchGameAction } from "./Actions"
import { Level } from "./ValueObjects"
import React from "react"
import { ShiftingColorBox, ShiftingColorBoxProps } from "./ShiftingColorBox"
import { useSeconds } from "./hooks"
import { Flash } from "./Flash"
import { ColorBox } from "./ColorBox"
import { ColorMatchViewModel } from "./ColorMatch"




export interface GameScreenProps extends ColorMatchViewModel
{
	dispatch: ( event: ColorMAtchGameAction ) => void
}


export function GameScreen( { life, targetHue, currentHue, level, dispatch }: GameScreenProps )
{
	const handleClickColor: ShiftingColorBoxProps["onColorSubmit"] = ( hue ) => dispatch( { type: "SUBMIT", payload: hue } )
	
	useSeconds( () => {
		dispatch( { type: "TICK" } )
	}, [ life, dispatch ] )
	
	return <>
		{life.value < 100 &&
		<Flash
			key={life.value}
			style={{
				zIndex: -1, background: `hsl(${targetHue.value}, 100%, 50%)`,
			}}
		/>}
		
		<ColorBox
			className="h-full flex-grow fade-in-scale-x"
			hue={targetHue}
			style={{ width: `${life.value}%` }}
		/>
		
		
		<div className="pt-2"/>
		
		<ShiftingColorBox
			defaultHue={currentHue}
			speed={level.speed}
			onColorSubmit={handleClickColor}
			style={{ width: `${life.value}%` }}
			className="h-full flex-grow fade-in-scale-x"
		/>
	</>
}


export function GameOverScreen( { level }: { level: Level } )
{
	return (
		<div className="flex-grow flex flex-col justify-center fade-in adrs-.3">
			<h2 className="uppercase px-4 py-4"
			    style={{ fontSize: 80 }}>
				Game Over
			</h2>
			<p className="text-4xl font-bold">You got to level {level.toString()}!</p>
		</div>)
}