import { Brand } from "utility-types"




type score = Brand<number, "score">

export class Hue
{
	static MAX: number = 360
	static MIN: number = 0
	
	
	private constructor( private _value: number )
	{
	}
	
	
	get value(): number
	{
		return this._value
	}
	
	
	shortestDistanceTo( target: Hue ): number
	{
		/*
		 * Target = 45
		 * Actual = 200
		 *
		 * 0------------------------------------------360
		 *           T                       A
		 *          ->----distance-----------<-           // Highest number - smallest number
		 *                                                // -> (A - T) -> (200 - 45) -> 155
		 *
		 * -revolved-<-                     ->-distance-- // (Highest possible value - highest value) + smallest value
		 *                                                // -> ((360 + A) + T)
		 *                                                // -> ((360 + 200) + 45)
		 *                                                // -> (160 + 45) -> 205
		 */
		const wheelEnd         = Hue.MAX,
		      distance         = Math.abs( this._value - target.value ),
		      revolvedDistance = Math.min( this._value, target.value ) + (wheelEnd - Math.max( this._value, target.value ))
		
		return Math.min( distance, revolvedDistance )
	}
	
	
	static random(): Hue
	{
		return new Hue( Math.floor( Math.random() * Hue.MAX ) )
	}
	
	
	static from( value: number )
	{
		if ( value < Hue.MIN || value > Hue.MAX )
			throw new Error( `Hue value must be a number between 0 and 360, you used "${value}"` )
		
		return new Hue( value )
	}
}

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
		return new Level( { stage: this.__stage + 1, speed: this.__speed * 1.15 } )
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