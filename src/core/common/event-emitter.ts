// Тип обработчика события
export type TEventHandler = (...args: unknown[]) => unknown

/**
 * Подписка на события
 * @example
 * const emitter = new TEventEmitter()
 * emitter.on('event', (data) => console.log(data))
 */
export class TEventEmitter {
	private _items: Map<string, Set<TEventHandler>> = new Map()

	on(event: string, handler: TEventHandler): void {
		let handlers = this._items.get(event)

		if (!handlers) {
			handlers = new Set()
			this._items.set(event, handlers)
		}

		handlers.add(handler)
	}

	off(event: string, handler: TEventHandler): void {
		this._items.get(event)?.delete(handler)
	}

	emit(event: string, ...args: unknown[]): void {
		this._items.get(event)?.forEach((handler) => handler(...args))
	}

	/**
	 * Выполняет событие и возвращает результат выполнения обработчиков.
	 * Если хотя бы один обработчик вернул false — возвращает false.
	 */
	emitWithResult(event: string, ...args: unknown[]): boolean {
		const handlers = this._items.get(event)

		if (!handlers) {
			return true
		}

		let result = true

		for (const handler of handlers) {
			if (handler(...args) === false) {
				result = false
			}
		}

		return result
	}

	/**
	 * Выполняет событие и возвращает первый не-undefined результат (short-circuit).
	 * Если ни один обработчик не вернул значение — возвращает undefined.
	 */
	emitResolve<T>(event: string, ...args: unknown[]): T | undefined {
		const handlers = this._items.get(event)

		if (!handlers) {
			return undefined
		}

		for (const handler of handlers) {
			const result = handler(...args)

			if (result !== undefined) {
				return result as T
			}
		}

		return undefined
	}

	/**
	 * Выполняет событие и возвращает все не-undefined результаты обработчиков.
	 */
	emitResolveAll<T>(event: string, ...args: unknown[]): T[] {
		const handlers = this._items.get(event)

		if (!handlers) {
			return []
		}

		const results: T[] = []

		for (const handler of handlers) {
			const result = handler(...args)

			if (result !== undefined) {
				results.push(result as T)
			}
		}

		return results
	}

	remove(event?: string): void {
		if (event) {
			this._items.delete(event)
		} else {
			this._items.clear()
		}
	}
}

