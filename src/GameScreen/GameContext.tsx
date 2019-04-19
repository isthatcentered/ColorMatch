import { Hue, Level, Life } from "./ValueObjects"
import React, { Component, createContext } from "react"
import { ColorMatchStateHandler, StartingNewLevelState } from "./GameBehaviors"
import { ColorMAtchGameAction } from "./Actions"




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