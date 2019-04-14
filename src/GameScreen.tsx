import { gameActions, playing } from "./types"
import React from "react"
import { ColorBox, ShiftingColorBox, ShiftingColorBoxProps } from "./ColorBox"
import { Link, RouteComponentProps } from "@reach/router"
import { GameOverScreen } from "./GameOverScreen"




interface GameScreenProps extends RouteComponentProps
{
	state: playing
	
	dispatch( action: gameActions ): void
}


export function GameScreen( { state: { targetHue, currentHue, level, life }, dispatch }: GameScreenProps )
{
	const handleClickColor: ShiftingColorBoxProps["onColorClick"] = ( hue ) =>
		dispatch( { type: "ColorSubmittedAction", payload: hue } )
	
	const minimumClickableWidth = 10,
	      boxesWidth            = Math.max( life.value, minimumClickableWidth )
	
	return life.value ?
	       (
		       <div className="text-white h-screen flex flex-col">
			       <header className="flex items-center p-4">
				       <h1 className="text-4xl font-bold">Color match!</h1>
				       <p className="ml-auto text-4xl font-bold">Level {level.toString()}</p>
			       </header>
			
			       <main className="text-center flex-grow flex flex-col items-center px-2">
				       <ColorBox
					       hue={targetHue}
					       style={{ width: `${boxesWidth}%` }}
				       />
				
				       <div className="pt-2"/>
				
				       <ShiftingColorBox
					       defaultHue={currentHue}
					       speed={level.speed}
					       onColorClick={handleClickColor}
					       className="cursor-pointer"
					       style={{ width: `${boxesWidth}%` }}
				       />
				
				       <Link to={"/"}
				             className="w-full text-center text-white block p-4 capitalize font-bold text-4xl">
					       Stop
				       </Link>
			       </main>
		       </div>) :
	       <GameOverScreen/>
}


