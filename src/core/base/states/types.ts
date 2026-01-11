/**
 * Универсальный тип конструктора стейта.
 * @template TState Тип интерфейса стейта.
 * @template TInitial Тип начального значения (по умолчанию boolean).
 */
import type { TStateCtor as TResolveStateCtor } from '../../common/resolve-state'

/**
 * Универсальный тип конструктора стейта.
 *
 * Важно: параметр `initial` типизирован как обязательный,
 * чтобы корректно совпадать с сигнатурой `resolveState(...)`.
 * При этом реальные классы могут иметь `constructor(initial?: ...)` —
 * это остаётся совместимым.
 */
export type TStateCtor<TState, TInitial = boolean> = TResolveStateCtor<TState, TInitial>
