import type { IInputControl, IInputControlProps, TInputControlEvents } from '../../base/input-control'


export interface ISwitchProps extends IInputControlProps<boolean | undefined> {
	// value наследуется от IInputControlProps<boolean | undefined>
}

export type TSwitchEvents = TInputControlEvents<boolean | undefined> & {
	// Событие изменения значения
	change: ({ event, value }: { event: Event; value: boolean | undefined }) => void
	/** legacy alias (compat with UI emits) */
	changeValue: (value: boolean | undefined) => void
}

export interface ISwitch extends IInputControl<boolean | undefined, ISwitchProps, TSwitchEvents> {
	/** Переключает состояние компонента */
	change(event?: Event): void
}
