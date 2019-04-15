import { Hue } from "./Hue"




export type Action = { readonly type: string }

type Submit = { type: "SUBMIT", payload: Hue } & Action
type Restart = { type: "RESTART" } & Action
type Tick = { type: "TICK" } & Action

export type ColorMAtchGameActions = Restart | Submit | Tick
