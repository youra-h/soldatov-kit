export type TDragPluginEvents = {
	'drag:start': (payload: { index: number; uid: number }) => void
	'drag:end': () => void
}
