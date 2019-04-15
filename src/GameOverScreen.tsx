import * as React from "react"
import { RouteComponentProps } from "@reach/router"
import { ColorMAtchGameActions } from "./types"




interface GameOverScreenProps extends RouteComponentProps
{
	dispatch( action: ColorMAtchGameActions ): void
}


export function GameOverScreen( { dispatch }: GameOverScreenProps )
{
	return (
		<div className="text-white h-screen flex flex-col">
			<header className="flex items-center p-4"
			        style={{ background: "#ff0044" }}
			>
				<h1 className="text-4xl font-bold">Color match!</h1>
				<p className="ml-auto text-4xl font-bold">Level @fix</p>
			</header>
			<main className="text-center flex-grow flex flex-col ">
				<div className="flex-grow flex flex-col justify-around">
					<h2 className="uppercase px-4 py-20 "
					    style={{ fontSize: 80 }}>
						Game Over
					</h2>
					<p className="text-4xl font-bold">You got to level @fix!</p>
				</div>
				<button onClick={() => dispatch( { type: "RESTART" } )}
				        className="w-full text-center text-white block p-4 capitalize font-bold text-4xl"
				        style={{ backgroundColor: "#55dd44" }}
				>
					Play again
				</button>
			</main>
		</div>)
}