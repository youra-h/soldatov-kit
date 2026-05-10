// Тип обработчика события
export type TEventHandler = (...args: unknown[]) => unknown

// Базовый интерфейс для совместимости
export interface IEventSource {
	on(event: string, handler: TEventHandler): void
	off(event: string, handler: TEventHandler): void
}

export interface IEventEmitter extends IEventSource {
	emit(event: string, ...args: unknown[]): void
	emitWithResult(event: string, ...args: unknown[]): boolean
	emitResolve<T>(event: string, ...args: unknown[]): T | undefined
	emitResolveAll<T>(event: string, ...args: unknown[]): T[]
	remove(event?: string): void
}

/**
 * Обобщённый эмиттер, где Events — словарь событий и их сигнатур.
 * @example
 * const emitter = new TEventEmitter<{ greet: (msg: string) => void }>()
 * emitter.emit('greet', 123) // Ошибка
 */
export class TEventEmitter<
	Events extends Record<string, (...args: any[]) => any> = Record<
		string,
		(...args: any[]) => any
	>,
> implements IEventEmitter {
	private _items: Map<string, Set<TEventHandler>> = new Map()

	on<K extends keyof Events>(event: K, handler: Events[K]): void {
		let handlers = this._items.get(event as string)
		if (!handlers) {
			handlers = new Set()
			this._items.set(event as string, handlers)
		}
		handlers.add(handler as TEventHandler)
	}

	off<K extends keyof Events>(event: K, handler: Events[K]): void {
		this._items.get(event as string)?.delete(handler as TEventHandler)
	}

	emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void {
		this._items.get(event as string)?.forEach((handler) => handler(...args))
	}

	/**
	 * Выполняет событие и возвращает результат выполнения обработчиков.
	 * Если хотя бы один обработчик вернул false — возвращает false.
	 */
	emitWithResult<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): boolean {
		const handlers = this._items.get(event as string)
		if (!handlers) return true

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
	emitResolve<T, K extends keyof Events>(
		event: K,
		...args: Parameters<Events[K]>
	): T | undefined {
		const handlers = this._items.get(event as string)

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
	emitResolveAll<T, K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): T[] {
		const handlers = this._items.get(event as string)

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
