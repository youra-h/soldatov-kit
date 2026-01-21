import type { ITextable, ITextableProps, TTextableEvents, TTextableStatesOptions } from '../../base/textable'
import type { TComponentVariant } from '../../common/types'
import type { TStateCtor } from '../../base/states'
import type { ILoadingState, ILoadingBehavior } from '../../base/states'
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
}

export type TButtonEvents = TTextableEvents & {
	'change:loading': (value: boolean) => void
}

export type TButtonStatesOptions = TTextableStatesOptions & {
	loading?: TStateCtor<ILoadingState<TSpinner>, boolean | ILoadingBehavior<TSpinner>> | ILoadingState<TSpinner>
}

export interface IButton extends ITextable<IButtonProps, TButtonEvents> {}
