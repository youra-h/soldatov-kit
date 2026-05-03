export type TElementPluginEvents = {
	ready: (ctx: { element: HTMLElement }) => void
	removed: () => void
}
