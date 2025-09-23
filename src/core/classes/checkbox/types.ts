import type { IControlValue, TControlValueEventsMap } from '../control-value'

export interface ICheckBox extends IControlValue {
	// Значение контрола
	value: any
}

export type TCheckBoxEventsMap = TControlValueEventsMap & {}
