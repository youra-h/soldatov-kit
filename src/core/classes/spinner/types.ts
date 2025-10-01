import type { IComponent, TComponentEvents } from '../component'
import type { TComponentSize, TComponentVariant } from '../../common/types'

export interface ISpinner extends IComponent {
	// Размер компонента
	size?: TComponentSize
	// Вариант отображения компонента
	variant?: TComponentVariant
	// Толщина бордера
	borderWidth?: number | 'auto'
}

export type TSpinnerEvents = TComponentEvents & {}
