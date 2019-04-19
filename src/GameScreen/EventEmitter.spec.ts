type listener = ( ...args: any[] ) => any

type unsubscribeFn = () => void

type EventMap = Record<string, any>

class EventEmitter<M extends EventMap>
{
	private _listeners: Map<keyof M, listener[]> = new Map<string, listener[]>()
	
	
	on<K extends keyof M>( event: K, listener: ( payload: M[K] ) => any ): unsubscribeFn
	{
		const alreadyRegistered = this._listeners.get( event ) || []
		
		this._listeners.set( event, [ ...alreadyRegistered, listener ] )
		
		return () => {
			const subscribed = this._listeners.get( event )! // we do have a listener, we just added one
			this._listeners.set( event, subscribed.filter( l => l !== listener ) )
		}
	}
	
	
	fire<K extends keyof M>( event: K, payload?: undefined ): void
	fire<K extends keyof M>( event: K, payload: M[K] ): void
	fire<K extends keyof M>( event: K, payload: M[K] ): void
	{
		if ( this._listeners.has( event ) )
			this._listeners.get( event )!
				.forEach( l => l( payload ) )
	}
}

// addEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
// interface WindowEventMap extends GlobalEventHandlersEventMap, WindowEventHandlersEventMap
// {
// 	"abort": UIEvent;
// 	"afterprint": Event;
// 	"beforeprint": Event;
// }

interface eventsMap
{
	"WAFFLES": undefined
	"EventWithPayload": { hello: "world" }
	"A": undefined
	"B": undefined
}

describe( `EventEmitter`, () => {
	let emitter: EventEmitter<eventsMap>
	
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
				emitter.on( "WAFFLES", firstListener )
				emitter.on( "WAFFLES", secondListener )
			} )
			
			When( () => {
				emitter.fire( "WAFFLES" )
			} )
			
			Then( `Calls every subscriber to this event`, () => {
				expect( firstListener ).toHaveBeenCalled()
				expect( secondListener ).toHaveBeenCalled()
			} )
		} )
		
		Scenario( `No subscribers`, () => {
			test( `Doesn't crash`, () => {
				expect( () => emitter.fire( "WAFFLES" ) ).not.toThrow()
			} )
		} )
	} )
	
	Feature( `I can unsubscribe from an EventEmitter`, () => {
		const listener = jest.fn()
		
		let unsubscribe: unsubscribeFn
		
		Given( () => {
			unsubscribe = emitter.on( "WAFFLES", listener )
		} )
		
		Then( `Event is not called anymore after unsubscribing`, () => {
			unsubscribe()
			
			emitter.fire( "WAFFLES" )
			
			expect( listener ).not.toHaveBeenCalled()
		} )
	} )
	
	Feature( `A payload can be passed to the event`, () => {
		const listener                               = jest.fn(),
		      payload: eventsMap["EventWithPayload"] = { hello: "world" }
		
		Given( () => {
			emitter.on( "EventWithPayload", listener )
		} )
		
		When( () => {
			emitter.fire( "EventWithPayload", payload )
		} )
		
		Then( `Listener should be passed the payload`, () => {
			expect( listener ).toHaveBeenCalledWith( payload )
		} )
	} )
	
	Feature( `Typehinting payload`, () => {
		Scenario( `No payload`, () => {
			Then( `I can fire the event without passing undefined`, () => {
				const emitter: EventEmitter<{ "Event": undefined }> = new EventEmitter()
				emitter.fire( "Event" )
			} )
		} )
		
		Scenario( `Payload defined`, () => {
			const emitter: EventEmitter<{ "Event": { hello: "world" } }> = new EventEmitter()
			
			Then( `Triggering the event requires the payload`, () => {
				emitter.fire( "Event", { hello: "world" } )
				emitter.fire( "Event" )
			} )
			
			And( `The listener know the payload type`, () => {
				emitter.on( "Event", ( e ) => {
					e.hello
				} )
			} )
		} )
	} )
	
	// 🛑 Switch to removeEventListener pattern ?
} )


export default undefined