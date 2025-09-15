import type { IComponent, TComponentEventsMap } from "../component"
import type { TControlSize } from '../utils/types'

export interface IControl extends IComponent {
	text: string
	disabled?: boolean
	focused?: boolean
	// Optional size property
	size?: TControlSize
}

export type TControlEventsMap = TComponentEventsMap & {
	focus: () => void
	changeText: (value: string) => void
	click: () => void
	enabled: (value: boolean) => void
}
