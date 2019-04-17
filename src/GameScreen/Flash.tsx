import React, { HTMLAttributes } from "react"




export function Flash( props: HTMLAttributes<HTMLDivElement> )
{
	return (<div {...props} className={`Flash absolute w-full h-full pin pin-top pin-left bg-white pointer-events-none ${props.className}`}/>)
}