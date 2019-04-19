import React from "react"
import { HomeScreen } from "./HomeScreen"
import { ColorMatch, GameContextProvider } from "./GameScreen/ColorMatch"
import { Router } from "@reach/router"




export function App()
{
	return (
		<div className="App">
			<GameContextProvider>
				<Router>
					<HomeScreen path={"/"}/>
					<ColorMatch path={"/game"}/>
				</Router>
			</GameContextProvider>
		</div>)
}



