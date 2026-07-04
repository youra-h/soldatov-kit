import type {
	IInputControl,
	IInputControlProps,
	TInputControlEvents,
} from '../../base/input-control'

export interface ICheckBoxProps extends IInputControlProps<boolean | undefined> {
	// value наследуется от IInputControlProps<boolean | undefined>
	// Отображать ли состояние "не определено"
	indeterminate?: boolean
	// Только отображать значение, без анимации и бордеров
	plain?: boolean
}

export type TCheckBoxEvents = TInputControlEvents<boolean | undefined> & {
	'change:indeterminate': (value: boolean) => void
	'change:plain': (value: boolean) => void
}

export interface ICheckBox extends IInputControl<
	boolean | undefined,
	ICheckBoxProps,
	TCheckBoxEvents
> {
	/** Состояние "не определено" */
	indeterminate: boolean
	/** Упрощенный вид */
	plain: boolean
	/** Переключает состояние чекбокса */
	toggle(): void
	/** Возвращает значение для aria-атрибута checked */
	getAriaChecked(): 'true' | 'false' | 'mixed'
}
