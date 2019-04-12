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
export type gameActions = { type: string }