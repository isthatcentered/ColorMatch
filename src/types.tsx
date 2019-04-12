// States
export type awaiting = {
	type: "awaiting"
}
export type playing = {
	type: "playing"
	currentHue: number,
	targetHue: number,
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

export type ColorSubmittedAction = { type: "ColorSubmittedAction", payload: number }

export type gameActions = ColorSubmittedAction