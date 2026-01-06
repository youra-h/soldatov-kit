import type { IPresentable, IPresentableProps, TPresentableEvents } from '../../base/presentable'
import type { TComponentSize, TComponentVariant } from '../../common/types'

export interface ISpinnerProps extends IPresentableProps {
	// Размер компонента
	size?: TComponentSize
	// Вариант отображения компонента
	variant?: TComponentVariant
	// Толщина бордера
	borderWidth?: number | 'auto'
}

export type TSpinnerEvents = TPresentableEvents & {}

export interface ISpinner extends IPresentable<ISpinnerProps, TSpinnerEvents> {
	size: TComponentSize
	variant: TComponentVariant
}
