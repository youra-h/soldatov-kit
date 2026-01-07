import type { TComponentSize, TComponentVariant } from '../../common/types'
import type { IPresentable, IPresentableProps, TPresentableEvents } from '../presentable'
import type { IPresentableOptions, TPresentableStatesOptions } from '../presentable'
import type {
	IModifierValueState,
	TModifierValueStateCtor,
	TSizeStateOptions,
	TVariantStateOptions,
} from '../states'

export type TStylableEvents = TPresentableEvents & {
	/** change:size */
	'change:size': (value: TComponentSize) => void
	/** change:variant */
	'change:variant': (value: TComponentVariant) => void
}

export interface IStylableProps extends IPresentableProps {
	size?: TComponentSize
	variant?: TComponentVariant
}

export type TStylableStatesOptions = {
	createSize?: (options: TSizeStateOptions) => IModifierValueState<TComponentSize>
	size?: TModifierValueStateCtor<TComponentSize>
	createVariant?: (options: TVariantStateOptions) => IModifierValueState<TComponentVariant>
	variant?: TModifierValueStateCtor<TComponentVariant>
}

export interface IStylableOptions<TProps extends IStylableProps = IStylableProps>
	extends IPresentableOptions<TProps>
{
	states?: TPresentableStatesOptions & TStylableStatesOptions
}

export interface IStylable<
	TProps extends IStylableProps = IStylableProps,
	TEvents extends Record<string, (...args: any) => any> = TStylableEvents,
> extends IPresentable<TProps, TEvents> {
	size: TComponentSize
	variant: TComponentVariant
}
