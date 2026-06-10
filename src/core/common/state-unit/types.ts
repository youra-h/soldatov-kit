import { TEvented } from '../evented'
import type { TValuePayload } from '../types'

export type TStateUnitValueEvents<TValue> = {
	change: (payload: TValuePayload<TValue>) => void
}

/**
 * Контракт value-based state.
 * Все state-units имеют `value`, `rawValue`, `resolver` и событие `change`.
 */
export interface IStateUnit<
	TValue,
	TEvents extends TStateUnitValueEvents<TValue> = TStateUnitValueEvents<TValue>,
> {
	/** Значение после применения резольвера (если задан). */
	value: TValue
	/** Хранимое значение без резольвера. */
	readonly rawValue: TValue
	/** Текущий резольвер или undefined. */
	readonly resolver: ((value: TValue) => TValue) | undefined
	readonly events: TEvented<TEvents>
}
