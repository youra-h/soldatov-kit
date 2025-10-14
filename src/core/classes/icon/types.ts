import type { IComponent, TComponentEvents } from '../component'
import type { TComponentSize } from '../../common/types'

export interface IIcon extends IComponent {
	// Размер иконки
	size?: TComponentSize
	// Ширина иконки
	width?: number | string
	// Высота иконки
	height?: number | string
}

export type TIconEvents = TComponentEvents & {}
