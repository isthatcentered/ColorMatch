// States
import { Hue } from "./Hue"




export type awaiting = {
	type: "awaiting"
}
export type playing = {
	type: "playing"
	currentHue: Hue,
	targetHue: Hue,
	life: number,
	level: number
}
export type defeated = {
	type: "defeated"
	level: number,
}
export type gameState = awaiting | playing | defeated


// Actions
export type Action = { readonly type: string }

export type ColorSubmittedAction = { type: "ColorSubmittedAction", payload: Hue }
export type QuitGameAction = { type: "QuitGameAction" }
export type StartGameAction = { type: "StartGameAction" }

export type gameActions = ColorSubmittedAction | StartGameAction | QuitGameAction