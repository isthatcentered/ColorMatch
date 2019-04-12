export function computeShortestHueDistance( target: number, actual: number ): number
{
	const hueWheelLength             = 360,
	      distance                   = Math.abs( actual - target ),
	      startOfWheelToLeftValue    = Math.min( actual, target ), // target can't be both the smallest and the highest,
	      rightValueToEndOfWheelStep = Math.abs( Math.max( actual, target ) - hueWheelLength ), // so we automatically get the opposits
	      revolvedDistance           = startOfWheelToLeftValue + rightValueToEndOfWheelStep
	
	return Math.min( distance, revolvedDistance )
}


describe( `Actual > target `, () => {
	test.each( [
		[ 200, 0, 160 ],
		[ 200, 45, 155 ],
		[ 200, 150, 50 ],
	] )( `computeShortestHueDistance(%i,%i) => %i `, ( target, actual, _expected ) => {
		expect( computeShortestHueDistance( target, actual ) ).toBe( _expected )
	} )
} )

describe( `Target > actual`, () => {
	test.each( [
		[ 0, 200, 160 ],
		[ 45, 200, 155 ],
		[ 150, 200, 50 ],
	] )( `computeShortestHueDistance(%i,%i) => %i `, ( target, actual, _expected ) => {
		expect( computeShortestHueDistance( target, actual ) ).toBe( _expected )
	} )
} )



export default undefined
