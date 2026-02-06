import type { IComponentView, IComponentViewProps, TComponentViewEvents } from '../../base/component-view'
import type { TComponentSize } from '../../common/types'


export interface IIconProps extends IComponentViewProps {
	// Размер иконки
	size?: TComponentSize
	// Ширина иконки
	width?: number | string
	// Высота иконки
	height?: number | string
}

export type TIconEvents = TComponentViewEvents & {
	/** change:size */
	'change:size': (value: TComponentSize) => void
}

export interface IIcon extends IComponentView<IIconProps, TIconEvents> {
	/** Размер иконки */
	size: TComponentSize
	/** Ширина иконки */
	width?: number | string
	/** Высота иконки */
	height?: number | string
}
