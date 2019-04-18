import React, { HTMLAttributes } from "react"
import { storiesOf } from "@storybook/react"
//@ts-ignore
import { ColorBox } from "../GameScreen/ColorBox"
import { Hue } from "../GameScreen/ValueObjects"
import "../index.scss"




function Display( props: HTMLAttributes<HTMLDivElement> )
{
	return <div
		{...props}
		className={`relative p-4 ${props.className || ""}`}>
	</div>
}


storiesOf( "ColorBox", module )
	.add( "with text", () =>
		<Display>
			<ColorBox
				hue={Hue.random()}
				className="h-64"
			/>
		</Display> )
