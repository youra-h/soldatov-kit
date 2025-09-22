import type { IComponent, TComponentEventsMap } from '../component'
import type { TComponentSize } from '../../common/types'

export type TIconSize = Exclude<TComponentSize, 'xl' | '2xl'>

export interface IIcon extends IComponent {
	// Размер иконки
	size?: TIconSize
	// Ширина иконки
	width?: number | string
	// Высота иконки
	height?: number | string
}

export type TIconEventsMap = TComponentEventsMap & {}
