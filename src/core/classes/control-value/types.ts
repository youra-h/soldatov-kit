import type { IControl, TControlEvents } from '../control'

export interface IControlValue extends IControl {
	// Значение контрола
	value?: any
}

export type TControlValueEvents = TControlEvents & {
	// Событие изменения текста
	changeValue: (value: any) => void
}
