import type { ITextable, ITextableProps, TTextableEvents, TTextableStatesOptions } from '../../base/textable'
import type { TComponentVariant } from '../../common/types'
import type { TStateCtor } from '../../base/states'
import type { ILoadingState, ILoadingBehavior } from '../../base/states'

export type TButtonAppearance = 'normal' | 'plain' | 'outlined'

export interface IButtonProps extends ITextableProps {
	// Вариант отображения кнопки
	variant?: TComponentVariant
	// Внешний вид кнопки
	appearance?: TButtonAppearance
	// Показать индикатор загрузки
	loading?: boolean
}

export type TButtonEvents = TTextableEvents & {
	'change:loading': (value: boolean) => void
}

export type TButtonStatesOptions = TTextableStatesOptions & {
	loading?: TStateCtor<ILoadingState, boolean | ILoadingBehavior> | ILoadingState
}

export interface IButton extends ITextable<IButtonProps, TButtonEvents> {
	/** Внешний вид кнопки */
	appearance: TButtonAppearance
	/** Показывается ли индикатор загрузки */
	loading: boolean
	/** State объект управления загрузкой */
	readonly loadingState: ILoadingState
}
