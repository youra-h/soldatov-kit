import type { ITextable, ITextableProps, TTextableEvents } from '../../base/textable'
import type { TComponentVariant } from '../../common/types'
import { TIcon } from '../icon'
import { TSpinner } from '../spinner'

export type TButtonAppearance = 'normal' | 'plain' | 'outlined'

export interface IButtonProps extends ITextableProps {
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

export type TButtonEvents = TTextableEvents & {}

export interface IButton extends ITextable<IButtonProps, TButtonEvents> {}
