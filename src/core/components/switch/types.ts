import type { IInputControl, IInputControlProps, TInputControlEvents } from '../../base/input-control'
import type { TIcon } from '../icon'


export interface ISwitchProps extends IInputControlProps<boolean | null> {
	value: boolean | null
	// Иконка для состояния "включено"
	icon?: TIcon
}

export type TSwitchEvents = TInputControlEvents<boolean | null> & {
	// Событие изменения значения
	change: ({ event, value }: { event: Event; value: boolean | null }) => void
	/** legacy alias (compat with UI emits) */
	changeValue: (value: boolean | null) => void
}

export interface ISwitch extends IInputControl<boolean | null, ISwitchProps, TSwitchEvents> {}
