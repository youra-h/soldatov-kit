import type { IControlInput, TControlInputEvents } from '../control-input'
import type { TIcon } from '../icon'

export interface ISwitch extends IControlInput {
	value: boolean
	// Иконка для состояния "включено"
	icon?: TIcon
}

export type TSwitchEvents = TControlInputEvents & {
	change: (value: boolean) => void
}
