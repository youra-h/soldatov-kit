import type { IPresentable, IPresentableProps, TPresentableEvents } from '../../base/presentable'
import type { TComponentSize } from '../../common/types'


export interface IIconProps extends IPresentableProps {
	// Размер иконки
	size?: TComponentSize
	// Ширина иконки
	width?: number | string
	// Высота иконки
	height?: number | string
}

export type TIconEvents = TPresentableEvents & {
	/** change:size */
	'change:size': (value: TComponentSize) => void
}

export interface IIcon extends IPresentable<IIconProps, TIconEvents> {
	size: TComponentSize
	width?: number | string
	height?: number | string
}
