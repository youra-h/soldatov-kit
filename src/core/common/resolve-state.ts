export type TStateCtor<TState, TInitial> = new (initial?: TInitial) => TState

export type TStateInput<TState, TInitial> = TStateCtor<TState, TInitial> | TState | undefined

export type TResolveStateOptions<TState, TInitial> = {
	/**
	 * Called only when an instance is provided.
	 * Useful if you want to sync instance with the passed initial value.
	 */
	applyInitialToInstance?: (state: TState, initial: TInitial) => void
}

/**
 * Resolves state dependency from either:
 * - a constructor (class)
 * - a ready instance
 * - undefined (falls back to default ctor)
 */
export function resolveState<TState, TInitial>(
	input: TStateInput<TState, TInitial>,
	defaultCtor: TStateCtor<TState, TInitial>,
	initial: TInitial,
	options?: TResolveStateOptions<TState, TInitial>,
): TState {
	if (typeof input === 'function') {
		// TS can't know that a generic TState isn't also a Function,
		// so we cast the runtime-checked branch to a newable ctor.
		return new (input as TStateCtor<TState, TInitial>)(initial)
	}

	if (input) {
		options?.applyInitialToInstance?.(input, initial)
		return input
	}

	return new defaultCtor(initial)
}
