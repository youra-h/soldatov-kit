import type { IControl, IControlProps, TControlEvents } from '../../base/control'

// Элемент, имеющий значение
export interface IHasValue {
	value?: unknown
}

export interface IControlValueProps extends IControlProps, IHasValue {}

export type TControlValueEvents = TControlEvents & {
	// Событие изменения текста
	changeValue: (value: unknown) => void
}

export interface IControlValue<
	TProps extends IControlValueProps = IControlValueProps,
	TEvents = TControlValueEvents,
> extends IControl<TProps, TEvents> {}
