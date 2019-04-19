import React from "react"
import { HomeScreen } from "./HomeScreen"
import { ColorMatch } from "./GameScreen/ColorMatch"
import { Router } from "@reach/router"




export function App()
{
	return (
		<div className="App" >
			<Router>
				<HomeScreen path={"/"}/>
				<ColorMatch path={"/game"}/>
			</Router>
		</div>)
}



