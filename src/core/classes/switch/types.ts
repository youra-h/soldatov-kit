import type { IControlInput, TControlInputEventsMap } from '../control-input'
import type { TIcon } from '../icon'

export interface ISwitch extends IControlInput {
	value: boolean
	// Иконка для состояния "включено"
	icon?: TIcon
}

export type TSwitchEventsMap = TControlInputEventsMap & {
	change: (value: boolean) => void
}
