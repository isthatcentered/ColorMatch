type listener = ( ...args: any[] ) => any

type unsubscribeFn = () => void

class EventEmitter
{
	
	_listeners: Map<string, listener[]> = new Map<string, listener[]>()
	
	
	on( event: string, listener: () => any ): unsubscribeFn
	{
		const alreadyRegistered = this._listeners.get( event ) || []
		
		this._listeners.set( event, [ ...alreadyRegistered, listener ] )
		
		return () => {
			const subscribed = this._listeners.get( event )! // we do have a listener, we just added one
			this._listeners.set( event, subscribed.filter( l => l !== listener ) )
		}
	}
	
	
	fire( event: string, payload?: any ): void
	{
		if ( this._listeners.has( event ) )
			this._listeners.get( event )!
				.forEach( l => l( payload ) )
	}
}


describe( `EventEmitter`, () => {
	let emitter: EventEmitter
	
	beforeEach( () => emitter = new EventEmitter() )
	
	Feature( `I can subscribe to an EventEmitter`, () => {
		Scenario( `Triggering an event with subscribers`, () => {
			const eventAListener = jest.fn(),
			      eventBListener = jest.fn()
			
			Given( () => {
				emitter.on( "A", eventAListener )
				emitter.on( "B", eventBListener )
			} )
			
			When( () => {
				emitter.fire( "A" )
			} )
			
			Then( `Only subscribers to the fired "A" event are called`, () => {
				expect( eventAListener ).toHaveBeenCalled()
				expect( eventBListener ).not.toHaveBeenCalled()
			} )
		} )
		
		Scenario( `Multiple subscribers for an event`, () => {
			const firstListener  = jest.fn(),
			      secondListener = jest.fn()
			
			Given( () => {
				emitter.on( "blah", firstListener )
				emitter.on( "blah", secondListener )
			} )
			
			When( () => {
				emitter.fire( "blah" )
			} )
			
			Then( `Calls every subscriber to this event`, () => {
				expect( firstListener ).toHaveBeenCalled()
				expect( secondListener ).toHaveBeenCalled()
			} )
		} )
		
		Scenario( `No subscribers`, () => {
			test( `Doesn't crash`, () => {
				expect( () => emitter.fire( "blah" ) ).not.toThrow()
			} )
		} )
	} )
	
	Feature( `I can unsubscribe from an EventEmitter`, () => {
		const listener = jest.fn()
		
		let unsubscribe: unsubscribeFn
		
		Given( () => {
			unsubscribe = emitter.on( "blah", listener )
		} )
		
		Then( `Event is not called anymore after unsubscribing`, () => {
			unsubscribe()
			
			emitter.fire( "blah" )
			
			expect( listener ).not.toHaveBeenCalled()
		} )
	} )
	
	Feature( `A payload can be passed to the event`, () => {
		const listener = jest.fn(),
		      payload  = "payload"
		
		Given( () => {
			emitter.on( "blah", listener )
		} )
		
		When( () => {
			emitter.fire( "blah", payload )
		} )
		
		Then( `Listener should be passed the payload`, () => {
			expect( listener ).toHaveBeenCalledWith( payload )
		} )
	} )
	
	// typing/mapping event -> payload {[event: ""|""|""]: paylaod[ev]
} )


export default undefined