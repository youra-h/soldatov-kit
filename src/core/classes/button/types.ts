import type { IControl, TControlEventsMap } from '../control'
import type { TComponentVariant } from '../../common/types'
import { TIcon } from '../icon'

export type TButtonAppearance = 'normal' | 'plain' | 'outlined'

export interface IButton extends IControl {
	// Вариант отображения кнопки
	variant?: TComponentVariant
	// Внешний вид кнопки
	appearance?: TButtonAppearance
	// Иконка кнопки
	icon?: TIcon
}

export type TButtonEventsMap = TControlEventsMap & {}
