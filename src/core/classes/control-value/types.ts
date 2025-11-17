import type { IControlProps, TControlEvents } from '../control'

// Элемент, имеющий значение
export interface IHasValue {
	value?: any
}

export interface IControlValueProps extends IControlProps, IHasValue {}

export type TControlValueEvents = TControlEvents & {
	// Событие изменения текста
	changeValue: (value: any) => void
}
