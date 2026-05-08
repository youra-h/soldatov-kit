import { TEvented } from '../evented'

export type TStateUnitValueEvents<TValue> = {
	change: (payload: { newValue: TValue; oldValue: TValue }) => void
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
