import { TEvented } from '../../common/evented'

export type TStateUnitValueEvents<TValue> = {
	change: (value: TValue) => void
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
