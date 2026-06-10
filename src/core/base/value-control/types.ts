import type { IControl, IControlProps, TControlEvents, TControlStates } from '../control'
import type { IStateUnit } from '../../common/state-unit'
import { type TValuePayload } from '../../common/types'

export type TValueControlEvents<T> = TControlEvents & {
	/** change:value */
	'change:value': (payload: TValuePayload<T>) => void
	/** input:value (опционально) */
	'input:value': (value: T) => void
	/** change:name */
	'change:name': (value: string) => void
}

export interface IValueControlProps<TValue> extends IControlProps {
	value?: TValue
	name?: string
}

export type TValueControlStates<TValue> = TControlStates & {
	value: IStateUnit<TValue>
}

export interface IValueControl<
	TValue,
	TProps extends IValueControlProps<TValue> = IValueControlProps<TValue>,
	TEvents extends Record<string, (...args: any) => any> = TValueControlEvents<TValue>,
	TStates extends TValueControlStates<TValue> = TValueControlStates<TValue>,
> extends IControl<TProps, TEvents, TStates> {
	value: TValue
	name: string
}
