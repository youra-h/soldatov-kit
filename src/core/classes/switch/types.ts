import type { IControlInputProps, TControlInputEvents } from '../control-input'
import type { TIcon } from '../icon'

export interface ISwitch extends IControlInputProps {
	value: boolean
	// Иконка для состояния "включено"
	icon?: TIcon
}

export type TSwitchEvents = TControlInputEvents & {
	change: (value: boolean) => void
}
