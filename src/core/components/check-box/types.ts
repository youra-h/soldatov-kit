import type { IInputControl, IInputControlProps, TInputControlEvents } from '../../base/input-control'
import type { TIcon } from '../icon'


export interface ICheckBoxProps extends IInputControlProps<boolean | null> {
	value: boolean | null
	// Отображать ли состояние "не определено"
	indeterminate?: boolean
	// Только отображать значение, без анимации и бордеров
	plain?: boolean
}

export type TCheckBoxEvents = TInputControlEvents<boolean | null> & {
	change: ({ event, value }: { event: Event; value: boolean | null }) => void
	changeIndeterminate: (value: boolean) => void
	/** legacy alias (compat with UI emits) */
	changeValue: (value: boolean | null) => void
}

export interface ICheckBox extends IInputControl<boolean | null, ICheckBoxProps, TCheckBoxEvents> {
	/** Состояние "не определено" */
	indeterminate: boolean
	/** Упрощенный вид */
	plain: boolean
	/** Иконка для состояния "отмечено" */
	icon?: TIcon
	/** Иконка для состояния "не определено" */
	indeterminateIcon?: TIcon
	/** Переключает состояние чекбокса */
	change(event?: Event): void
	/** Возвращает значение для aria-атрибута checked */
	getAriaChecked(): 'true' | 'false' | 'mixed'
}
