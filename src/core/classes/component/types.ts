export interface IComponent {
	id?: string | number
	tag?: string | Object
	visible?: boolean
	hidden?: boolean
}

export type TComponentEventsMap = {
	show: () => void
	hide: () => void
	beforeShow: () => boolean
	afterShow: () => void
	beforeHide: () => boolean
	afterHide: () => void
	visible: (visible: boolean) => void
}
