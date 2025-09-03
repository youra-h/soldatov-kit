import type { IComponent, TComponentEventsMap } from "../component"

export interface IControl extends IComponent {
	text: string
	disabled?: boolean
	focused?: boolean
}

export type TControlEventsMap = TComponentEventsMap & {
	focus: () => void
	changeText: (value: string) => void
	click: () => void
	enabled: (value: boolean) => void
}
