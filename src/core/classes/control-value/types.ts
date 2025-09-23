import type { IControl, TControlEventsMap } from '../control'

export interface IControlValue extends IControl {
	// Значение контрола
	value: any
}

export type TControlValueEventsMap = TControlEventsMap & {
	// Событие изменения текста
	changeValue: (value: any) => void
}
