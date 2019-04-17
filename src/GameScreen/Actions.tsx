import { Hue } from "./ValueObjects"




type Action = { readonly type: string }

type Submit = { type: "SUBMIT", payload: Hue } & Action

type Restart = { type: "RESTART" } & Action

type Tick = { type: "TICK" } & Action

export type ColorMAtchGameAction = Restart | Submit | Tick