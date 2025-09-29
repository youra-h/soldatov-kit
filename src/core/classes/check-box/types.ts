import type { IControlValue, TControlValueEventsMap } from '../control-value'
import type { TIcon } from '../icon'

export interface ICheckBox extends IControlValue {
	// Отображать ли состояние "не определено"
	indeterminate?: boolean
	// Только отображать значение, без анимации и бордеров
	plain?: boolean
	// Иконка для состояния "отмечено"
	icon?: TIcon
	// Иконка для состояния "не определено"
	indeterminateIcon?: TIcon
}

export type TCheckBoxEventsMap = TControlValueEventsMap & {
	changeIndeterminate: (value: boolean) => void
}
