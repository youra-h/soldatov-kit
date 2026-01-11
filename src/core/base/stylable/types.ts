import type { TComponentSize, TComponentVariant } from '../../common/types'
import type { IComponentView, IComponentViewProps, TComponentViewEvents } from '../component-view'
import type { TComponentViewStatesOptions } from '../component-view'
import type { IStylableModifierState, TSizeStateOptions, TVariantStateOptions } from '../states'
import type { TStateCtor } from '../states/types'

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
	size?: TStateCtor<IStylableModifierState<TComponentSize>, TSizeStateOptions> | IStylableModifierState<TComponentSize>
	variant?: TStateCtor<IStylableModifierState<TComponentVariant>, TVariantStateOptions> | IStylableModifierState<TComponentVariant>
}

export interface IStylable<
	TProps extends IStylableProps = IStylableProps,
	TEvents extends Record<string, (...args: any) => any> = TStylableEvents,
> extends IComponentView<TProps, TEvents> {
	size: TComponentSize
	variant: TComponentVariant
}
