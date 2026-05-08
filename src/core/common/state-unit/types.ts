import { TEvented } from '../evented'
import type { TValuePayload } from '../types'

export type TStateUnitValueEvents<TValue> = {
	change: (payload: TValuePayload<TValue>) => void
}

/**
 * Контракт value-based state.
 * Все state-units имеют `value` и событие `change`.
 */
export interface IStateUnit<
	TValue,
	TEvents extends TStateUnitValueEvents<TValue> = TStateUnitValueEvents<TValue>,
> {
	value: TValue
	readonly events: TEvented<TEvents>
}
