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
	
	
	fire( event: string ): void
	{
		if ( this._listeners.has( event ) )
			this._listeners.get( event )!
				.forEach( l => l() )
	}
}


describe( `EventEmitter`, () => {
	describe( `Can be subscribed to`, () => {
		const eventAListener = jest.fn(),
		      eventBListener = jest.fn(),
		      emitter        = new EventEmitter()
		
		Given( () => {
			emitter.on( "A", eventAListener )
			emitter.on( "B", eventBListener )
		} )
		
		When( () => {
			emitter.fire( "A" )
		} )
		
		test( `Only triggers the subscribers to the triggered event`, () => {
			expect( eventAListener ).toHaveBeenCalled()
			expect( eventBListener ).not.toHaveBeenCalled()
		} )
	} )
	
	describe( `Can have multiple subscribers for the same event`, () => {
		const firstListener  = jest.fn(),
		      secondListener = jest.fn(),
		      emitter        = new EventEmitter()
		
		Given( () => {
			emitter.on( "blah", firstListener )
			emitter.on( "blah", secondListener )
		} )
		
		When( () => {
			emitter.fire( "blah" )
		} )
		
		test( `Calls every subscriber to this event`, () => {
			expect( firstListener ).toHaveBeenCalled()
			expect( secondListener ).toHaveBeenCalled()
		} )
	} )
	
	describe( `An event can stop listening`, () => {
		const listener = jest.fn(),
		      emitter  = new EventEmitter()
		
		let unsubscribe: unsubscribeFn
		
		Given( () => {
			unsubscribe = emitter.on( "blah", listener )

			emitter.fire( "blah" )
			
			expect( listener ).toHaveBeenCalled()
			
			listener.mockReset()
		} )
		
		test( `Event is not called anymore after unsubscribing`, () => {
			unsubscribe()
			
			emitter.fire( "blah" )
			
			expect( listener ).not.toHaveBeenCalled()
		} )
	} )
	// passing a payload
	// typing/mapping event -> payload {[event: ""|""|""]: paylaod[ev]
	// Doesn't fail when triggering events with nithing registered
} )


export default undefined