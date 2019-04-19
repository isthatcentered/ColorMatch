type listener = ( ...args: any[] ) => any
type EventMap = Record<string, any>

export class EventEmitter<M extends EventMap>
{
	private _listeners: Map<keyof M, listener[]> = new Map<string, listener[]>()
	
	
	on<K extends keyof M>( event: K, listener: ( payload: M[K] ) => any ): void
	{
		this._listeners.set( event, [ ...this._safeGetListeners( event ), listener ] )
	}
	
	
	fire<K extends keyof M>( event: K, payload: M[K] ): void
	{
		this._safeGetListeners( event )
			.forEach( l => l( payload ) )
	}
	
	
	removeListener<K extends keyof M>( event: K, listener: listener )
	{
		const newSubscribersList = this._safeGetListeners( event ).filter( s => s !== listener )
		
		this._listeners.set( event, newSubscribersList )
	}
	
	
	private _safeGetListeners( event: keyof M ): listener[]
	{
		return this._listeners.get( event ) || []
	}
}