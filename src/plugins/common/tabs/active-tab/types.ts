export type TActiveTabOffset = {
	listEl: HTMLElement
	offsetLeft: number
	offsetWidth: number
	offsetTop: number
	offsetHeight: number
}

export type TTabsActiveTabPluginEvents = {
	'active-tab:change': (offset: TActiveTabOffset | null) => void
}
