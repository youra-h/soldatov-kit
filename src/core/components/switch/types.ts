import type { IInputControl, IInputControlProps, TInputControlEvents } from '../../base/input-control'


export interface ISwitchProps extends IInputControlProps<boolean | null> {
	value: boolean | null
}

export type TSwitchEvents = TInputControlEvents<boolean | null> & {
	// Событие изменения значения
	change: ({ event, value }: { event: Event; value: boolean | null }) => void
	/** legacy alias (compat with UI emits) */
	changeValue: (value: boolean | null) => void
}

export interface ISwitch extends IInputControl<boolean | null, ISwitchProps, TSwitchEvents> {
	/** Переключает состояние компонента */
	change(event?: Event): void
}
