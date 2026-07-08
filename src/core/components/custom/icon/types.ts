import type {
	IComponentView,
	IComponentViewProps,
	TComponentViewEvents,
	TComponentViewStates,
} from '../../base/component-view'
import type { TValuePayload, TComponentSize } from '../../../bridge'
import type { IStateUnit } from '../../../common'

export interface IIconProps extends IComponentViewProps {
	// Размер иконки
	size?: TComponentSize
	// Ширина иконки
	width?: number | string
	// Высота иконки
	height?: number | string
}

export type TIconStates = TComponentViewStates & {
	size: IStateUnit<TComponentSize>
}

export type TIconEvents = TComponentViewEvents & {
	/** change:size */
	'change:size': (payload: TValuePayload<TComponentSize>) => void
	'change:width': (value: number | string | undefined) => void
	'change:height': (value: number | string | undefined) => void
}

export interface IIcon extends IComponentView<IIconProps, TIconEvents, TIconStates> {
	/** Размер иконки */
	size: TComponentSize
	/** Ширина иконки */
	width?: number | string
	/** Высота иконки */
	height?: number | string
}
