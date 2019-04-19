import { EventEmitter } from "./EventEmitter"




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
				emitter.fire( "A", undefined )
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
				emitter.fire( "WAFFLES", undefined )
			} )
			
			Then( `Calls every subscriber to this event`, () => {
				expect( firstListener ).toHaveBeenCalled()
				expect( secondListener ).toHaveBeenCalled()
			} )
		} )
		
		Scenario( `No subscribers`, () => {
			test( `Doesn't crash`, () => {
				expect( () => emitter.fire( "WAFFLES", undefined ) ).not.toThrow()
			} )
		} )
	} )
	
	Feature( `I can unsubscribe from an EventEmitter`, () => {
		const listener = jest.fn()
		
		Given( () => {
			emitter.on( "WAFFLES", listener )
		} )
		
		Then( `Event is not called anymore after unsubscribing`, () => {
			emitter.removeListener( "WAFFLES", listener )
			
			emitter.fire( "WAFFLES", undefined )
			
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
				emitter.fire( "Event", undefined )
			} )
		} )
		
		Scenario( `Payload defined`, () => {
			const emitter: EventEmitter<{ "Event": { hello: "world" } }> = new EventEmitter()
			
			Then( `Triggering the event requires the payload`, () => {
				emitter.fire( "Event", { hello: "world" } )
			} )
			
			And( `The listener know the payload type`, () => {
				emitter.on( "Event", ( e ) => {
					e.hello
				} )
			} )
		} )
	} )
} )


export default undefined