import type { IComponentView, IComponentViewProps, TComponentViewEvents, TComponentViewStatesOptions } from '../../base/component-view'
import type { TComponentSize } from '../../common/types'
import type { TValuePayload } from '../../common/types'
import type { IStateUnit } from '../../common/state-unit'
import type { TStateCtor } from '../../common/states'

export interface IIconProps extends IComponentViewProps {
	// Размер иконки
	size?: TComponentSize
	// Ширина иконки
	width?: number | string
	// Высота иконки
	height?: number | string
}

export type TIconStatesOptions = TComponentViewStatesOptions & {
	size?: TStateCtor<IStateUnit<TComponentSize>, TComponentSize> | IStateUnit<TComponentSize>
}

export type TIconEvents = TComponentViewEvents & {
	/** change:size */
	'change:size': (payload: TValuePayload<TComponentSize>) => void
}

export interface IIcon extends IComponentView<IIconProps, TIconEvents> {
	/** Размер иконки */
	size: TComponentSize
	/** Ширина иконки */
	width?: number | string
	/** Высота иконки */
	height?: number | string
}
