import React from "react"
import { HomeScreen } from "./HomeScreen"
import { GameScreen } from "./GameScreen/GameBehaviors"
import { Router } from "@reach/router"




export function App()
{
	return (
		<div className="App "
		     style={{ background: "#000" }}>
			<Router>
				<HomeScreen path={"/"}/>
				<GameScreen path={"/game"}/>
			</Router>
		</div>)
}



