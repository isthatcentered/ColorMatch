import { Brand } from "utility-types"
import { Hue } from "./Hue"




type score = Brand<number, "score">

export class Points
{
	static for( target: Hue, actual: Hue ): score
	{
		const missedTargetBy   = actual.shortestDistanceTo( target ),
		      huePoints        = Hue.MAX - missedTargetBy, // given target 50 & actual 49 -> 359
		      percentagePoints = Math.floor( huePoints * (100 / 360) )
		
		if ( percentagePoints >= 100 )
			return 10 as score
		
		else if ( percentagePoints >= 99 )
			return 5 as score
		else
			return -(100 - percentagePoints) as score
	}
}

export class Level
{
	private readonly __stage: number
	private readonly __speed: number
	
	
	constructor( { stage, speed }: { stage: number, speed: number } )
	{
		this.__stage = stage
		this.__speed = speed
	}
	
	
	next(): Level
	{
		return new Level( { stage: this.__stage + 1, speed: this.__speed * 1.25 } )
	}
	
	
	toString(): string
	{
		return this.__stage.toString()
	}
	
	
	get speed(): number
	{
		return this.__speed
	}
}

export class Life
{
	private readonly __value: number
	
	
	constructor( value: number )
	{
		if ( value < 0 || value > 100 )
			throw new Error( `Life must be a value between 0 and 100, you gave "${value}"` )
		
		this.__value = value
	}
	
	
	toString(): string
	{
		return this.__value.toString()
	}
	
	
	get value(): number
	{
		return this.__value
	}
	
	
	take( points: ReturnType<typeof Points["for"]> ): Life
	{
		const health = Math.min( Math.max( 0, this.__value + points ), 100 ) // Math.max 'cause score can be negative
		
		if ( health <= 0 )
			throw new Error( `☠️ no life left` )
		
		return new Life( health )
	}
}