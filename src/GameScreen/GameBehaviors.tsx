import { ColorMAtchGameAction } from "./Actions"
import { Hue, Level, Life, Points } from "./ValueObjects"
import React from "react"
import { ColorMatchViewModel, getInitialState } from "./ColorMatch"




export interface ColorMatchStateHandler extends ColorMatchViewModel
{
	handleEvent( event: ColorMAtchGameAction ): ColorMatchStateHandler
	
	render(): ColorMatchViewModel
}

export class StartingNewLevelState implements ColorMatchStateHandler
{
	private _ticksSinceLastSubmit: number = 0
	
	currentHue: Hue
	level: Level
	life: Life
	targetHue: Hue
	
	
	constructor( { currentHue, level, life, targetHue }: ColorMatchViewModel )
	{
		this.currentHue = currentHue
		this.level = level
		this.life = life
		this.targetHue = targetHue
	}
	
	
	handleEvent( event: ColorMAtchGameAction ): ColorMatchStateHandler
	{
		switch ( event.type ) {
			case "TICK":
				this._ticksSinceLastSubmit++
				
				const shoulgGoIntoSurvivalMode = this._haveNthSecondsPassed( 4 ) &&
					this._hadTimeToRevolveHueWheel( this.level.speed )
				
				return shoulgGoIntoSurvivalMode ?
				       new SurvivalState( this ) :
				       this
			
			case "SUBMIT":
				try {
					this.life = this.life.take( Points.for( this.targetHue, event.payload ) )
					this.targetHue = Hue.random()
					this.level = this.level.next() // you didn't die, you get to go to the next level
					
					return new StartingNewLevelState( this )
				} catch ( e ) {
					this.life = new Life( 0 )
					return new GameOverState( this )
				}
			
			case "RESTART":
				return new StartingNewLevelState( getInitialState() )
			
			default:
				ensureAllCasesHandled( event )
		}
		
		return this
	}
	
	
	render(): ColorMatchViewModel
	{
		return {
			currentHue: this.currentHue,
			level:      this.level,
			life:       this.life,
			targetHue:  this.targetHue,
		}
	}
	
	
	private _haveNthSecondsPassed = ( seconds: number ): boolean => {
		return this._ticksSinceLastSubmit >= seconds
	}
	
	
	private _hadTimeToRevolveHueWheel = ( rotationSpeed: number ): boolean => {
		const timeRequiredToRevolve = (Hue.MAX / rotationSpeed) / 60
		return this._ticksSinceLastSubmit >= timeRequiredToRevolve
	}
	
}

export class SurvivalState extends StartingNewLevelState implements ColorMatchStateHandler
{
	handleEvent( event: ColorMAtchGameAction ): ColorMatchStateHandler
	{
		switch ( event.type ) {
			case "TICK":
				try {
					this.life = new Life( this.life.value - 1 )
					return this
				} catch ( e ) {
					this.life = new Life( 0 )
					return new GameOverState( this )
				}
			
			case "SUBMIT":
				return super.handleEvent( event )
			
			case "RESTART":
				return super.handleEvent( event )
			
			default:
				ensureAllCasesHandled( event )
		}
		
		return super.handleEvent( event )
	}
}

export class GameOverState extends StartingNewLevelState implements ColorMatchStateHandler
{
	handleEvent( event: ColorMAtchGameAction ): ColorMatchStateHandler
	{
		switch ( event.type ) {
			
			case "TICK":
				return this
			case "SUBMIT":
				return this
			
			case "RESTART":
				return super.handleEvent( event )
			
			default:
				ensureAllCasesHandled( event )
		}
		
		return super.handleEvent( event )
	}
}


export function ensureAllCasesHandled( switchedUpon: never )
{
	throw new Error( `Switch case not handled` )
}