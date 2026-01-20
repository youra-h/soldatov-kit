import type { IControl, IControlProps, TControlEvents, TControlStatesOptions } from '../control'
import type { IStateUnit } from '../state-unit'
import type { TStateCtor } from '../states'

export type TValueControlEvents<T> = TControlEvents & {
	/** change:value */
	'change:value': (value: T) => void
	/** input:value (опционально) */
	'input:value': (value: T) => void
	/** change:name */
	'change:name': (value: string) => void
}

export interface IValueControlProps<TValue> extends IControlProps {
	value: TValue
	name?: string
}

export type TValueControlStatesOptions<TValue> = TControlStatesOptions & {
	value?: TStateCtor<IStateUnit<TValue>, TValue> | IStateUnit<TValue>
}

export interface IValueControl<
	TValue,
	TProps extends IValueControlProps<TValue> = IValueControlProps<TValue>,
	TEvents extends Record<string, (...args: any) => any> = TValueControlEvents<TValue>,
> extends IControl<TProps, TEvents> {
	value: TValue
	name: string
	input(value: TValue): void
}
