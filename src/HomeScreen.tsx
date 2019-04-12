import React from "react"
import { gameActions } from "./types"




interface HomeScreenProps
{
	dispatch( action: gameActions ): void
}


export function HomeScreen( { dispatch }: HomeScreenProps )
{
	return (
		<div className="text-white h-screen flex flex-col">
			<header className="flex items-center p-4"
			        style={{ background: "#ff0044" }}
			>
				<h1 className="text-4xl font-bold">Color match!</h1>
				<p className="ml-auto text-4xl font-bold">Level 1</p>
			</header>
			<main className="text-center flex-grow flex flex-col">
				<h2 className="uppercase px-4 py-20 flex-grow flex items-center"
				    style={{ fontSize: 80 }}>
					Match the colors!
				</h2>
				<button onClick={() => dispatch( { type: "StartGameAction" } )}
				        className="w-full text-center text-white block p-4 capitalize font-bold text-4xl"
				        style={{ backgroundColor: "#55dd44" }}
				>
					Start game
				</button>
			</main>
		</div>)
}