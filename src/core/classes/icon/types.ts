import type { IComponent, IComponentProps, TComponentEvents } from '../component'
import type { TComponentSize } from '../../common/types'

export interface IIconProps extends IComponentProps {
	// Размер иконки
	size?: TComponentSize
	// Ширина иконки
	width?: number | string
	// Высота иконки
	height?: number | string
}

export type TIconEvents = TComponentEvents & {}

export interface IIcon extends IComponent<IIconProps, TIconEvents> {}
