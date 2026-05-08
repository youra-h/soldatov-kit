import type {
	IComponentView,
	IComponentViewProps,
	TComponentViewEvents,
	TComponentViewStatesOptions,
} from '../../base/component-view'
import type { TComponentSize, TComponentVariant, TValuePayload } from '../../common/types'
import type { IStateUnit } from '../../common/state-unit'
import type { TStateCtor } from '../../common/states'

export interface ISpinnerProps extends IComponentViewProps {
	// Размер компонента
	size?: TComponentSize
	// Вариант отображения компонента
	variant?: TComponentVariant
	// Толщина бордера
	borderWidth?: number | 'auto'
}

export type TSpinnerStatesOptions = TComponentViewStatesOptions & {
	size?: TStateCtor<IStateUnit<TComponentSize>, TComponentSize> | IStateUnit<TComponentSize>
	variant?: TStateCtor<IStateUnit<TComponentVariant>, TComponentVariant> | IStateUnit<TComponentVariant>
}

export type TSpinnerEvents = TComponentViewEvents & {
	'change:size': (payload: TValuePayload<TComponentSize>) => void
	'change:variant': (payload: TValuePayload<TComponentVariant>) => void
}

export interface ISpinner extends IComponentView<ISpinnerProps, TSpinnerEvents> {
	/** Размер компонента */
	size: TComponentSize
	/** Вариант отображения */
	variant: TComponentVariant
	/** Толщина бордера */
	borderWidth: number | 'auto'
}
