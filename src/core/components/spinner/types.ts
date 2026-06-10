import type {
	IComponentView,
	IComponentViewProps,
	TComponentViewEvents,
	TComponentViewStates,
} from '../../base/component-view'
import type { TComponentSize, TComponentVariant, TValuePayload } from '../../common/types'
import type { IStateUnit } from '../../common/state-unit'

export interface ISpinnerProps extends IComponentViewProps {
	// Размер компонента
	size?: TComponentSize
	// Вариант отображения компонента
	variant?: TComponentVariant
	// Толщина бордера
	borderWidth?: number | 'auto'
}

export type TSpinnerStates = TComponentViewStates & {
	size: IStateUnit<TComponentSize>
	variant: IStateUnit<TComponentVariant>
}

export type TSpinnerEvents = TComponentViewEvents & {
	'change:size': (payload: TValuePayload<TComponentSize>) => void
	'change:variant': (payload: TValuePayload<TComponentVariant>) => void
	'change:borderWidth': (value: number | 'auto') => void
}

export interface ISpinner extends IComponentView<ISpinnerProps, TSpinnerEvents, TSpinnerStates> {
	/** Размер компонента */
	size: TComponentSize
	/** Вариант отображения */
	variant: TComponentVariant
	/** Толщина бордера */
	borderWidth: number | 'auto'
}
