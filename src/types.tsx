// States
import { Hue } from "./Hue"
import { Level, Life } from "./ValueObjects"




export type awaiting = {
	type: "awaiting"
}
export type playing = {
	type: "playing"
	currentHue: Hue,
	targetHue: Hue,
	life: Life,
	level: Level
}
export type defeated = {
	type: "defeated"
	level: Level,
}
export type gameState = playing


// Actions
export type Action = { readonly type: string }

export type ColorSubmittedAction = { type: "ColorSubmittedAction", payload: Hue }

export type gameActions = ColorSubmittedAction