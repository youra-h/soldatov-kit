import { TEvented } from '../../common/evented'

/**
 * Базовый контракт событий state-unit.
 *
 * Важно: `change` допускает произвольный набор аргументов.
 * По умолчанию это один аргумент — новое значение.
 * Но для некоторых стейтов удобно эмитить, например:
 * - `change(patch)` (patch-based)
 * - `change(next, prev)` (new/old)
 */
export type TStateUnitEvents = {
	change: (...args: any[]) => void
}

export type TStateUnitValueEvents<TValue, TArgs extends any[] = [TValue]> = {
	change: (...args: TArgs) => void
}

/**
 * Контракт value-based state.
 * Все state-units имеют `value` и событие `change`.
 */
export interface IStateUnit<
	TValue,
	TEvents extends TStateUnitEvents = TStateUnitValueEvents<TValue>,
> {
	value: TValue
	readonly events: TEvented<TEvents>
}
