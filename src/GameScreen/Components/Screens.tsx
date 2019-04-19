import { Level } from "../ValueObjects"
import React, { useContext, useEffect } from "react"
import { ShiftingColorBox, ShiftingColorBoxProps } from "./ShiftingColorBox"
import { useSeconds } from "../hooks"
import { Flash } from "./Flash"
import { ColorBox } from "./ColorBox"
import { GameContext} from "../GameContext"
import { BaseText, Heading } from "./Text"




export interface GameScreenProps
{
	onGameOver: () => void
}


export function GameScreen( { onGameOver }: GameScreenProps )
{
	const { dispatch, life, targetHue, currentHue, level } = useContext( GameContext )
	
	const handleClickColor: ShiftingColorBoxProps["onColorSubmit"] = ( hue ) => dispatch( { type: "SUBMIT", payload: hue } )
	
	const isGameOver: boolean = life.value <= 0
	
	useSeconds( () => {
		dispatch( { type: "TICK" } )
	}, [ life, dispatch ] )
	
	useEffect( () => {
		if ( isGameOver )
			onGameOver()
	}, [ isGameOver ] )
	
	return (
		!isGameOver ?
		<>
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
		</> :
		null)
}


export function GameOverScreen( { level }: { level: Level } )
{
	return (
		<div className="flex-grow flex flex-col justify-center fade-in adrs-.3">
			<h2 className=" px-4 py-4">
				<Heading>Game Over</Heading>
			</h2>
			<p>
				<BaseText>You got to level {level.toString()}!</BaseText>
			</p>
		</div>)
}


export function HomeScreen()
{
	return (
		<h2 className="px-4 py-20 flex-grow flex items-center">
			<Heading>Match the colors!</Heading>
		</h2>)
}