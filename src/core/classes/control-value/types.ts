import type { IControl, IControlProps, TControlEvents } from '../control'

// Элемент, имеющий значение
export interface IHasValue {
	value?: any
}

export interface IControlValueProps extends IControlProps, IHasValue {}

export type TControlValueEvents = TControlEvents & {
	// Событие изменения текста
	changeValue: (value: any) => void
}

export interface IControlValue<
	TProps extends IControlValueProps = IControlValueProps,
	TEvents = TControlValueEvents,
> extends IControl<TProps, TEvents> {}
