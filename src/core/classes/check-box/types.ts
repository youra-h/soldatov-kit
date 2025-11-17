import type { IControlInputProps, TControlInputEvents } from '../control-input'
import type { TIcon } from '../icon'

export interface ICheckBox extends IControlInputProps {
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

export type TCheckBoxEvents = TControlInputEvents & {
	change: (value: boolean | null) => void
	changeIndeterminate: (value: boolean) => void
}
