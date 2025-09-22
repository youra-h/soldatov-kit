import type { IComponent, TComponentEventsMap } from '../component'
import type { TControlSize } from '../../common/types'

export interface IIcon extends IComponent {
	size?: TControlSize
	width?: number | string
	height?: number | string
}

export type TIconEventsMap = TComponentEventsMap & {}
