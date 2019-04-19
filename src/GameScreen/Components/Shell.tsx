import { Level } from "../ValueObjects"
import React, { HTMLAttributes, ReactElement, ReactNode } from "react"
import { BaseText } from "./Text"




export function Shell( { action, level, children, transparent }: { action: ReactElement, level: Level, children: ReactNode, transparent: boolean } )
{
	const colors = transparent ?
	               { header: "transparent", footer: "transparent" } :
	               { header: "#ff0044", footer: "#55dd44" }
	
	return (
		<div className="text-white h-screen flex flex-col">
			<Header level={level}
			        style={{ background: colors.header }}/>
			
			<main className="text-center flex-grow flex flex-col items-center px-2">
				{children}
			</main>
			
			<Footer style={{ background: colors.footer }}>
				{action}
			</Footer>
		</div>)
}


function Header( { level, className = "", ...props }: { level: Level } & HTMLAttributes<HTMLDivElement>,
)
{
	return (
		<header {...props} className={`flex items-center p-4 transition ${className}`}>
			<h1>
				<BaseText>Color match!</BaseText>
			</h1>
			<p className="ml-auto">
				<BaseText>Level {level.toString()}</BaseText>
			</p>
		</header>)
}


function Footer( { children, className = "", ...props }: { children: ReactElement, } & HTMLAttributes<HTMLDivElement> )
{
	return (
		<div {...props} className={`w-full block transition ${className}`}>
			{children}
		</div>)
}