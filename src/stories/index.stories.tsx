import React, { HTMLAttributes } from "react"
import { storiesOf } from "@storybook/react"
//@ts-ignore
import { Hue, Level, Life } from "../GameScreen/ValueObjects"
import "../index.scss"
import { GameScreen } from "../GameScreen/Screens"




function Display( props: HTMLAttributes<HTMLDivElement> )
{
	return <div
		{...props}
		className={`relative p-4 ${props.className || ""}`}>
	</div>
}


storiesOf( "GameScreen", module )
	.add( "Playing", () =>
		<GameScreen
			level={new Level( { stage: 1, speed: .3 } )}
			dispatch={() => null}
			life={new Life( 100 )}
			currentHue={Hue.random()}
			targetHue={Hue.random()}
		/> )
	.add( "Game over", () =>
		<GameScreen
			level={new Level( { stage: 1, speed: .3 } )}
			dispatch={() => null}
			life={new Life( 0 )}
			currentHue={Hue.random()}
			targetHue={Hue.random()}
		/> )
