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