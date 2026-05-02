export type TElementPluginEvents = {
	'element:ready': (el: HTMLElement) => void
	'element:removed': () => void
}
