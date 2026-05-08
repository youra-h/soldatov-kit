export type TStateCtor<TState, TInitial> = new (initial: TInitial) => TState

export type TStateInput<TState, TInitial> = TStateCtor<TState, TInitial> | TState | undefined

export type TResolveStateOptions<TState, TInitial> = {
	/** Конструктор, инстанс или undefined. Если undefined — используется `ctor`. */
	state: TStateInput<TState, TInitial>
	/** Конструктор по умолчанию — используется если `state` не передан. */
	ctor: TStateCtor<TState, TInitial>
	/** Начальное значение — передаётся в конструктор при создании нового инстанса. */
	initial: TInitial
}

/**
 * Инжектирует state-зависимость:
 * - конструктор → создаёт новый инстанс через `new state(initial)`
 * - готовый инстанс → возвращает его как есть
 * - undefined → создаёт инстанс через `new ctor(initial)`
 */
export function resolveState<TState, TInitial>({
	state,
	ctor,
	initial,
}: TResolveStateOptions<TState, TInitial>): TState {
	if (typeof state === 'function') {
		return new (state as TStateCtor<TState, TInitial>)(initial)
	}

	if (state) {
		return state
	}

	return new ctor(initial)
}
