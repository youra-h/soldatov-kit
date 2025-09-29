import type { TComponentVariant } from '../../common/types'
import type { IControlValue, TControlValueEventsMap } from '../control-value'

export type TControlInputState = 'normal' | 'success' | 'warning' | 'error'

export interface IControlInput extends IControlValue {
	// Вариант отображения чекбокса
	variant?: TComponentVariant
	// Значение недоступно для редактирования
	readonly?: boolean
	// Значение обязательно для заполнения
	required?: boolean
	// Значение не валидно
	invalid?: boolean
	// Состояние контрола
	state?: TControlInputState
}

export type TControlInputEventsMap = TControlValueEventsMap & {}
