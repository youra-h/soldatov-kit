import type { IControlInput, TControlInputEventsMap } from '../control-input'
import type { TIcon } from '../icon'

export interface ICheckBox extends IControlInput {
	value: boolean | null
	// Отображать ли состояние "не определено"
	indeterminate?: boolean
	// Только отображать значение, без анимации и бордеров
	plain?: boolean
	// Иконка для состояния "отмечено"
	icon?: TIcon
	// Иконка для состояния "не определено"
	indeterminateIcon?: TIcon
}

export type TCheckBoxEventsMap = TControlInputEventsMap & {
	change: (value: boolean | null) => void
	changeIndeterminate: (value: boolean) => void
}
