import type { IComponent, IComponentProps, TComponentEvents } from '../../base/component'
import type { TComponentSize, TComponentVariant } from '../../common/types'

export interface ISpinnerProps extends IComponentProps {
	// Размер компонента
	size?: TComponentSize
	// Вариант отображения компонента
	variant?: TComponentVariant
	// Толщина бордера
	borderWidth?: number | 'auto'
}

export type TSpinnerEvents = TComponentEvents & {}

export interface ISpinner extends IComponent<ISpinnerProps, TSpinnerEvents> {}
