import React, { ReactNode, useContext, useState } from "react"
import { GameOverScreen, GameScreen, HomeScreen } from "./Screens"
import { Shell } from "./Shell"
import { BaseText } from "./Text"
import { GameContext } from "../GameContext"




/**
 * 🛑 Add victory streak
 * 🛑 Hit flashes as event subscribtion
 * 🛑 Victory feedback as event subscribtion
 * 🛑 Show some kind of "safe" time bar that decreases
 * 🛑 If you make >= 99% match in survival mode, you get back the points you lost in survival mode + a bonus
 * 🛑 Can you move computations to a service worker (clearly not worth it but intersting)
 * 🛑 Life system refactor
 */

export function ColorMatch( props: {} )
{
	const { dispatch, level }          = useContext( GameContext ),
	      [ screen, setScreen ]        = useState<screens>( "home" ),
	      config: ColorMatchViewConfig = {
		      home:     {
			      label:   "Start game",
			      onClick: () => setScreen( "game" ),
			      view:    <HomeScreen/>,
		      },
		      game:     {
			      label:   "Stop",
			      onClick: () => {
				      setScreen( "home" )
				      dispatch( { type: "RESTART" } )
			      },
			      view:    <GameScreen onGameOver={() => setScreen( "gameOver" )}/>,
		      },
		      gameOver: {
			      label:   "Retry",
			      onClick: () => {
				      setScreen( "game" )
				      dispatch( { type: "RESTART" } )
			      },
			      view:    <GameOverScreen level={level}/>,
		      },
	      }
	
	return (
		<Shell
			level={level}
			transparent={screen === "game"}
			action={
				<button onClick={config[ screen ].onClick}
				        className="text-center w-full p-4 capitalize "
				>
					<BaseText>{config[ screen ].label}</BaseText>
				</button>
			}
		>
			{config[ screen ].view}
		</Shell>)
}


type screens = "home" | "game" | "gameOver"

type ColorMatchViewConfig = Record<screens, { label: string, onClick: () => void, view: ReactNode }>
