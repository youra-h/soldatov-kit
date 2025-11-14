import type { IControl, TControlEvents } from '../control'

// Элемент, имеющий значение
export interface IHasValue {
	value?: any
}

export interface IControlValue extends IControl, IHasValue {}

export type TControlValueEvents = TControlEvents & {
	// Событие изменения текста
	changeValue: (value: any) => void
}
