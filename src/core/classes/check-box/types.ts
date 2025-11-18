import type { IControlInput, IControlInputProps, TControlInputEvents } from '../control-input'
import type { TIcon } from '../icon'

export interface ICheckBoxProps extends IControlInputProps {
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

export interface ICheckBox extends IControlInput<ICheckBoxProps, TCheckBoxEvents> {}
