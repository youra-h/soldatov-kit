import type { TComponentSize, TComponentVariant } from '../../common/types'
import type { IPresentable, IPresentableProps, TPresentableEvents } from '../presentable'

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

export interface IStylable<
	TProps extends IStylableProps = IStylableProps,
	TEvents extends Record<string, (...args: any) => any> = TStylableEvents,
> extends IPresentable<TProps, TEvents> {
	size: TComponentSize
	variant: TComponentVariant
}
