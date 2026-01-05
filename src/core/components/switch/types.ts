import type { IControlInput, IControlInputProps, TControlInputEvents } from '../control-input'
import type { TIcon } from '../icon'

export interface ISwitchProps extends IControlInputProps {
	value: boolean | null
	// Иконка для состояния "включено"
	icon?: TIcon
}

export type TSwitchEvents = TControlInputEvents & {
	// Событие изменения значения
	change: ({ event, value }: { event: Event; value: boolean | null }) => void
}

export interface ISwitch extends IControlInput<ISwitchProps, TSwitchEvents> {}
