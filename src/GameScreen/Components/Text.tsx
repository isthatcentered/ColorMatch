import React, { HTMLAttributes } from "react"




export function Heading( { className = "", style = {}, ...props }: HTMLAttributes<HTMLSpanElement> )
{
	return (
		<span
			{...props}
			className={`text-white block font-bold uppercase ${className}`}
			style={{ ...style, fontSize: 80 }}
		/>)
}


export function BaseText( { className = "", ...props }: HTMLAttributes<HTMLSpanElement> )
{
	return <span {...props} className={`text-white block font-bold text-4xl ${className}`}/>
}