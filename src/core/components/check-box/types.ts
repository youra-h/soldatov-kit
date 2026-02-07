import type { IInputControl, IInputControlProps, TInputControlEvents } from '../../base/input-control'


export interface ICheckBoxProps extends IInputControlProps<boolean | undefined> {
	// value наследуется от IInputControlProps<boolean | undefined>
	// Отображать ли состояние "не определено"
	indeterminate?: boolean
	// Только отображать значение, без анимации и бордеров
	plain?: boolean
}

export type TCheckBoxEvents = TInputControlEvents<boolean | undefined> & {
	change: ({ event, value }: { event: Event; value: boolean | undefined }) => void
	changeIndeterminate: (value: boolean) => void
	/** legacy alias (compat with UI emits) */
	changeValue: (value: boolean | undefined) => void
}

export interface ICheckBox extends IInputControl<boolean | undefined, ICheckBoxProps, TCheckBoxEvents> {
	/** Состояние "не определено" */
	indeterminate: boolean
	/** Упрощенный вид */
	plain: boolean
	/** Переключает состояние чекбокса */
	change(event?: Event): void
	/** Возвращает значение для aria-атрибута checked */
	getAriaChecked(): 'true' | 'false' | 'mixed'
}
