import type { TComponentSize, TComponentVariant } from '../../common/types'
import type { IComponentView, IComponentViewProps, TComponentViewEvents } from '../component-view'
import type { TComponentViewStatesOptions } from '../component-view'
import type { IModifierValueState, TModifierValueStateCtor } from '../states'

export type TStylableEvents = TComponentViewEvents & {
	/** change:size */
	'change:size': (value: TComponentSize) => void
	/** change:variant */
	'change:variant': (value: TComponentVariant) => void
}

export interface IStylableProps extends IComponentViewProps {
	size?: TComponentSize
	variant?: TComponentVariant
}

export type TStylableStatesOptions = TComponentViewStatesOptions & {
	size?: TModifierValueStateCtor<TComponentSize> | IModifierValueState<TComponentSize>
	variant?: TModifierValueStateCtor<TComponentVariant> | IModifierValueState<TComponentVariant>
}

export interface IStylable<
	TProps extends IStylableProps = IStylableProps,
	TEvents extends Record<string, (...args: any) => any> = TStylableEvents,
> extends IComponentView<TProps, TEvents> {
	size: TComponentSize
	variant: TComponentVariant
}
