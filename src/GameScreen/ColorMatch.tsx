import React, { Component, createContext, HTMLAttributes, ReactElement, ReactNode, useContext, useState } from "react"
import { RouteComponentProps } from "@reach/router"
import { Hue, Level, Life } from "./ValueObjects"
import { ColorMAtchGameAction } from "./Actions"
import { ColorMatchStateHandler, ensureAllCasesHandled, StartingNewLevelState } from "./GameBehaviors"
import { GameOverScreen, GameScreen } from "./Screens"




/**
 * ✅ Fix "play again" button on game over screen
 * ✅ Show a white flash on life lost
 * ✅ Dispatch a "tick" action on every tick
 * ✅ 1 point of life is lost on every tick
 * ✅ 1 point of life is lost on every second (aka if x ticks have passed)
 * ✅ 1 point of life is lost on every second only if time since last submit > 5s
 * ✅ 1 point of life is lost on every second only if time since last submit > 5s && wheel had time to revolve
 * ✅ Get rid of statHandler.render() -> cannot [this.handleEvent not defined]
 * ✅ Display death level in game over screen
 * ✅ Control via keyboard
 * ✅ Create shell component
 * 🛑 Create GameOverScreen & PlayingScreen & MenuScreen
 * 🛑 Use state reducer to control the views
 * 🛑 Hit flashes as event subscribtion
 * 🛑 Victory feedback as event subscribtion
 * 🛑 Add victory streak
 * 🛑 Victory indicator
 * 🛑 Show some kind of "safe" time bar that decreases
 * 🛑 If you make >= 99% match in survival mode, you get back the points you lost in survival mode + a bonus
 * 🛑 Transform hardoced actions into returntype<makeXAction>
 * 🛑 Can you move computations to a service worker (clearly not worth it but intersting)
 * 🛑 Life system refactor
 */

export const getInitialState = (): ColorMatchViewModel => {
	return {
		currentHue: Hue.random(),
		level:      new Level( { stage: 1, speed: .8 } ),
		life:       new Life( 100 ),
		targetHue:  Hue.random(),
	}
}

export type ColorMatchViewModel = {
	currentHue: Hue,
	targetHue: Hue,
	life: Life,
	level: Level
}


export const GameContext = createContext<ColorMatchViewModel & { dispatch: (( event: ColorMAtchGameAction ) => any) }>( {} as any )

export class GameContextProvider extends Component
{
	
	private _stateHandler: ColorMatchStateHandler = new StartingNewLevelState( getInitialState() )
	
	state = this._stateHandler.render()
	
	dispatch = ( event: ColorMAtchGameAction ) => {
		this._stateHandler = this._stateHandler.handleEvent( event )
		
		this.setState( this._stateHandler.render() )
	}
	
	
	render()
	{
		const { children } = this.props
		
		return (
			<GameContext.Provider value={{ ...this.state, dispatch: this.dispatch.bind( this ) }}>
				{children}
			</GameContext.Provider>)
	}
}

type screens = "home" | "game" | "gameOver"


export function ColorMatch( props: {} & RouteComponentProps )
{
	const { dispatch, ...gameState } = useContext( GameContext )
	const [ screen, setScreen ] = useState<screens>( "game" )
	
	const actions: Record<screens, { label: string, to: screens }> = {
		home:     { label: "Start game", to: "game" },
		game:     { label: "Stop", to: "home" },
		gameOver: { label: "Retry", to: "game" },
	}
	
	return (
		<Shell
			level={gameState.level}
			playing={screen === "game"}
			action={
				<ActionButton
					label={actions[ screen ].label}
					handleClick={() => setScreen( actions[ screen ].to )}
				/>}
		>
			{(() => {
				switch ( screen ) {
					case "home":
						return (
							<h2 className="uppercase px-4 py-20 flex-grow flex items-center"
							    style={{ fontSize: 80 }}>
								Match the colors!
							</h2>)
					
					case "game":
						return <GameScreen dispatch={dispatch} {...gameState}/>
					
					case "gameOver":
						return <GameOverScreen level={gameState.level}/>
					
					default:
						ensureAllCasesHandled( screen )
				}
			})()}
		</Shell>)
}


function Shell( { action, level, children, playing }: { action: ReactElement, level: Level, children: ReactNode, playing: boolean } )
{
	const colors = playing ?
	               { header: "transparent", footer: "transparent" } :
	               { header: "#ff0044", footer: "#55dd44" }
	
	return (
		<div className="text-white h-screen flex flex-col">
			<Header level={level}
			        style={{ background: colors.header }}/>
			
			<main className="text-center flex-grow flex flex-col items-center px-2">
				{children}
			</main>
			
			<Footer style={{ background: colors.footer }}>
				{action}
			</Footer>
		</div>)
}


function ActionButton( { label, handleClick }: { label: string, handleClick: () => void } )
{
	return (
		<button onClick={handleClick}
		        className="w-full text-center text-white block p-4 capitalize font-bold text-4xl"
		>
			{label}
		</button>)
}


function Header( { level, className = "", ...props }: { level: Level } & HTMLAttributes<HTMLDivElement>,
)
{
	return (
		<header {...props} className={`flex items-center p-4 transition ${className}`}>
			<h1 className="text-4xl font-bold">Color match!</h1>
			<p className="ml-auto text-4xl font-bold">Level {level.toString()}</p>
		</header>)
}


function Footer( { children, className = "", ...props }: { children: ReactElement, } & HTMLAttributes<HTMLDivElement> )
{
	return (
		<div {...props} className={`w-full block transition ${className}`}>
			{children}
		</div>)
}