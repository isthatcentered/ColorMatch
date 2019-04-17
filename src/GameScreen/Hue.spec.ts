import { Hue } from "./ValueObjects"




describe( `Actual > target `, () => {
	;[
		{ target: Hue.from( 200 ), actual: Hue.from( 0 ), expected: 160 },
		{ target: Hue.from( 200 ), actual: Hue.from( 45 ), expected: 155 },
		{ target: Hue.from( 200 ), actual: Hue.from( 150 ), expected: 50 },
	].forEach( ( { target, actual, expected } ) =>
		test( `Shortest distance to ${target.value} from ${actual.value} => ${expected}`, () =>
			expect( actual.shortestDistanceTo( target ) ).toBe( expected ),
		) )
} )

describe( `Target > actual `, () => {
	;[
		{ target: Hue.from( 0 ), actual: Hue.from( 200 ), expected: 160 },
		{ target: Hue.from( 45 ), actual: Hue.from( 200 ), expected: 155 },
		{ target: Hue.from( 150 ), actual: Hue.from( 200 ), expected: 50 },
	].forEach( ( { target, actual, expected } ) =>
		test( `Shortest distance to ${target.value} from ${actual.value} => ${expected}`, () =>
			expect( actual.shortestDistanceTo( target ) ).toBe( expected ),
		) )
} )

export default undefined
