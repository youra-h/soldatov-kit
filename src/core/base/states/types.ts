/**
 * Универсальный тип конструктора стейта.
 * @template TState Тип интерфейса стейта.
 * @template TInitial Тип начального значения (по умолчанию boolean).
 */
export type TStateCtor<TState, TInitial = boolean> = new (initial?: TInitial) => TState
