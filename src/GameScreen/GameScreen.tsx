import React from "react"
import { ColorBox } from "./ColorBox"
import { Link } from "@reach/router"
import { GameOverScreen } from "./GameOverScreen"
import { Hue, Level, Life } from "./ValueObjects"
import { ColorMAtchGameAction } from "./Actions"
import { useSeconds } from "./hooks"
import { ShiftingColorBox, ShiftingColorBoxProps } from "./ShiftingColorBox"
import { Flash } from "./Flash"




/**
 * ✅ Fix "play again" button on game over screen
 * ✅ Show a white flash on life lost
 * ✅ Dispatch a "tick" action on every tick
 * ✅ 1 point of life is lost on every tick
 * ✅ 1 point of life is lost on every second (aka if x ticks have passed)
 * ✅ 1 point of life is lost on every second only if time since last submit > 5s
 * ✅ 1 point of life is lost on every second only if time since last submit > 5s && wheel had time to revolve
 * ✅ Get rid of statHandler.render() -> cannot [this.handleEvent not defined]
 * ✅ Display death level in game over screen
 * ✅ Control via keyboard
 * 🛑 Animations
 *    🛑 Home Screen
 *    🛑 Game screen
 *    🛑 Game over screen
 *    🛑
 * 🛑 Transitions to game over screen
 * 🛑 Show some kind of "safe" time bar that decreases
 * 🛑 If you make >= 99% match in survival mode, you get back the points you lost in survival mode + a bonus
 * 🛑 Transform hardoced actions into returntype<makeXAction>
 * 🛑 Can you move computations to a service worker (clearly not worth it but intersting)
 * 🛑 Accessibility labeling
 */

export const getInitialState = (): ColorMatchViewModel => {
	return {
		currentHue: Hue.random(),
		level:      new Level( { stage: 1, speed: .8 } ),
		life:       new Life( 100 ),
		targetHue:  Hue.random(),
	}
}

export type ColorMatchViewModel = {
	currentHue: Hue,
	targetHue: Hue,
	life: Life,
	level: Level
}

export interface GameScreenViewProps extends ColorMatchViewModel
{
	dispatch: ( event: ColorMAtchGameAction ) => void
}


export function GameScreenView( { life, targetHue, currentHue, level, dispatch }: GameScreenViewProps )
{
	const handleClickColor: ShiftingColorBoxProps["onColorSubmit"] = ( hue ) => dispatch( { type: "SUBMIT", payload: hue } ),
	      isGameOver: boolean                                      = life.value <= 0
	
	useSeconds( () => {
		dispatch( { type: "TICK" } )
	}, [ life, dispatch ] )
	
	
	
	return !isGameOver ?
	       (
		       <div className="text-white h-screen flex flex-col">
			       <header className="flex items-center p-4">
				       <h1 className="text-4xl font-bold">Color match!</h1>
				       <p className="ml-auto text-4xl font-bold">Level {level.toString()}</p>
			       </header>
			
			       <main className="text-center flex-grow flex flex-col items-center px-2">
				
				       {life.value < 100 &&
				       <Flash
					       key={life.value}
					       style={{
						       zIndex: -1, background: `hsl(${targetHue.value}, 100%, 50%)`,
					       }}
				       />}
				
				       <ColorBox
					       className="h-full flex-grow"
					       hue={targetHue}
					       style={{ width: `${life.value}%` }}
				       />
				
				       <div className="pt-2"/>
				
				       <ShiftingColorBox
					       defaultHue={currentHue}
					       speed={level.speed}
					       onColorSubmit={handleClickColor}
					       style={{ width: `${life.value}%` }}
					       className="h-full flex-grow"
				       />
				
				       <Link to={"/"}
				             className="w-full text-center text-white block p-4 capitalize font-bold text-4xl">
					       Stop
				       </Link>
			       </main>
		       </div>) :
	       <GameOverScreen dispatch={dispatch}
	                       level={level}/>
}


