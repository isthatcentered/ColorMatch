// States
import { Hue } from "./Hue"
import { Level} from "./ValueObjects"
import { Life } from "./ValueObjects"




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
export type gameState = awaiting | playing | defeated


// Actions
export type Action = { readonly type: string }

export type ColorSubmittedAction = { type: "ColorSubmittedAction", payload: Hue }
export type QuitGameAction = { type: "QuitGameAction" }
export type StartGameAction = { type: "StartGameAction" }

export type gameActions = ColorSubmittedAction | StartGameAction | QuitGameAction