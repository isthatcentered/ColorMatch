// States
import { Hue } from "./Hue"
import { Level, Life } from "./ValueObjects"




// Actions
export type Action = { readonly type: string }

export type ColorSubmittedAction = { type: "ColorSubmittedAction", payload: Hue }

export type gameActions = ColorSubmittedAction