import type {
	IComponent,
	IComponentProps,
	TComponentEvents,
} from '../../base/component'
import type { IStateUnit } from '../../common/state-unit'
import type { IVisibilityState } from '../../common/states'

export interface IFrameProps extends IComponentProps {
	/** Позиция по оси X (px) */
	x?: number
	/** Позиция по оси Y (px) */
	y?: number
	/** Ширина (px или CSS-значение) */
	width?: number | string
	/** Высота (px или CSS-значение) */
	height?: number | string
	/** Видимость */
	visible?: boolean
}

export type TFrameStates = {
	visible: IVisibilityState
	x: IStateUnit<number>
	y: IStateUnit<number>
	width: IStateUnit<number | string>
	height: IStateUnit<number | string>
}

export type TFrameEvents = TComponentEvents & {
	/** change:visible */
	'change:visible': (value: boolean) => void
	/** change:x */
	'change:x': (value: number) => void
	/** change:y */
	'change:y': (value: number) => void
	/** change:width */
	'change:width': (value: number | string) => void
	/** change:height */
	'change:height': (value: number | string) => void
	/** change:zIndex — срабатывает при изменении z-index */
	'change:zIndex': (value: number) => void
	/** beforeShow (можно отменить, вернув false) */
	beforeShow: () => boolean
	/** beforeHide (можно отменить, вернув false) */
	beforeHide: () => boolean
	/** show */
	show: () => void
	/** hide */
	hide: () => void
}

export interface IFrame extends IComponent<IFrameProps, TFrameEvents, TFrameStates> {
	/** Видимость */
	visible: boolean
	/** Позиция по оси X */
	x: number
	/** Позиция по оси Y */
	y: number
	/** Ширина */
	width: number | string
	/** Высота */
	height: number | string
	/** Текущий z-index (readonly) */
	readonly zIndex: number
	/** Показать */
	show(): void
	/** Скрыть */
	hide(): void
}
