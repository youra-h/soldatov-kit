import type {
	IInputControl,
	IInputControlProps,
	TInputControlEvents,
} from '../../base/input-control'

export interface ISwitchProps extends IInputControlProps<boolean | undefined> {
}

export type TSwitchEvents = TInputControlEvents<boolean | undefined> & {
}

export interface ISwitch extends IInputControl<boolean | undefined, ISwitchProps, TSwitchEvents> {
	/** Переключает состояние компонента */
	toggle(): void
}
