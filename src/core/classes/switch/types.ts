import type { IControlInput, IControlInputProps, TControlInputEvents } from '../control-input'
import type { TIcon } from '../icon'

export interface ISwitchProps extends IControlInputProps {
	value: boolean
	// Иконка для состояния "включено"
	icon?: TIcon
}

export type TSwitchEvents = TControlInputEvents & {
	change: (value: boolean) => void
}

export interface ISwitch extends IControlInput<ISwitchProps, TSwitchEvents> {}
