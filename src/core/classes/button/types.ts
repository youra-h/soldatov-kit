import type { IControl, TControlEvents } from '../control'
import type { TComponentVariant } from '../../common/types'
import { TIcon } from '../icon'
import { TSpinner } from '../spinner'

export type TButtonAppearance = 'normal' | 'plain' | 'outlined'

export interface IButton extends IControl {
	// Вариант отображения кнопки
	variant?: TComponentVariant
	// Внешний вид кнопки
	appearance?: TButtonAppearance
	// Иконка кнопки
	icon?: TIcon
	// Показать индикатор загрузки
	loading?: boolean
	// Индикатор загрузки
	spinner?: TSpinner
}

export type TButtonEvents = TControlEvents & {}
