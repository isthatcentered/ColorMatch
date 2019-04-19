import React from "react"
import { ColorMatch} from "./GameScreen/Components/ColorMatch"
import { GameContextProvider } from "./GameScreen/GameContext"




export function App()
{
	return (
		<div className="App">
			<GameContextProvider>
				<ColorMatch/>
			</GameContextProvider>
		</div>)
}



