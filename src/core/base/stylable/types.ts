import type { TComponentSize, TComponentVariant } from '../../common/types'
import type { IComponentView, IComponentViewProps, TComponentViewEvents } from '../component-view'
import type { TComponentViewStatesOptions } from '../component-view'
import type { IStateUnit } from '../../common/state-unit'
import type { TStateCtor } from '../../common/states'
import { type TValuePayload } from '../../common/types'

export type TStylableEvents = TComponentViewEvents & {
	/** change:size */
	'change:size': (payload: TValuePayload<TComponentSize>) => void
	/** change:variant */
	'change:variant': (payload: TValuePayload<TComponentVariant>) => void
}

export interface IStylableProps extends IComponentViewProps {
	size?: TComponentSize
	variant?: TComponentVariant
}

export type TStylableStatesOptions = TComponentViewStatesOptions & {
	size?: TStateCtor<IStateUnit<TComponentSize>, TComponentSize> | IStateUnit<TComponentSize>
	variant?:
		| TStateCtor<IStateUnit<TComponentVariant>, TComponentVariant>
		| IStateUnit<TComponentVariant>
}

export interface IStylable<
	TProps extends IStylableProps = IStylableProps,
	TEvents extends Record<string, (...args: any) => any> = TStylableEvents,
> extends IComponentView<TProps, TEvents> {
	size: TComponentSize
	variant: TComponentVariant
}
