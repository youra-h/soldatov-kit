import type { TComponentVariant } from '../../common/types'
import type { IControlValueProps, TControlValueEvents } from '../control-value'
import { TSpinner } from '../spinner'

export type TControlInputState = 'normal' | 'success' | 'warning' | 'error'

export interface IControlInput extends IControlValueProps {
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
	// Показать индикатор загрузки
	loading?: boolean
	// Индикатор загрузки
	spinner?: TSpinner
}

export type TControlInputEvents = TControlValueEvents & {}
