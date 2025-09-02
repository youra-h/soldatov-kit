export interface IComponent {
	id?: string | number
	visible?: boolean
	hidden?: boolean
}

export type TComponentEventsMap = {
	'show': () => void
	'hide': () => void
	'visible': (visible: boolean) => void
}
