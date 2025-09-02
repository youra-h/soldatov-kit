import type { IComponent, TComponentEventsMap } from "../component"

export interface IControl extends IComponent {
	text: string
	disabled?: boolean
	focused?: boolean
}

export type TControlEventsMap = TComponentEventsMap & {
	'focus': () => void
	'change': (value: string) => void
}
