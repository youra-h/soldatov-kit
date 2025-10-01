import type { IComponent, TComponentEvents } from '../component'
import type { TComponentSize } from '../../common/types'

export type TIconSize = TComponentSize

export interface IIcon extends IComponent {
	// Размер иконки
	size?: TIconSize
	// Ширина иконки
	width?: number | string
	// Высота иконки
	height?: number | string
}

export type TIconEvents = TComponentEvents & {}
