// Тип обработчика события
export type TEventHandler = (...args: unknown[]) => unknown
// Тип карты событий
export type TEventMap = Record<string, TEventHandler[]>

/**
 * Подписка на события
 * @example
 * const emitter = new TEventEmitter()
 * emitter.on('event', (data) => console.log(data))
 */
export class TEventEmitter {
	private _items: TEventMap = {}

	on(event: string, handler: TEventHandler): void {
		if (!this._items[event]) {
			this._items[event] = []
		}

		this._items[event].push(handler)
	}

	off(event: string, handler: TEventHandler): void {
		if (!this._items[event]) {
			return
		}

		this._items[event] = this._items[event].filter((h) => h !== handler)
	}

	emit(event: string, ...args: unknown[]): void {
		if (!this._items[event]) {
			return
		}

		this._items[event].forEach((handler) => handler(...args))
	}

	/**
	 * Выполняет событие и возвращает результат выполнения обработчиков
	 * @param event
	 * @param args
	 * @returns {boolean}
	 */
	emitWithResult(event: string, ...args: unknown[]): boolean {
		if (!this._items[event]) {
			return true
		}

		let result = true

		for (const handler of this._items[event]) {
			const res = handler(...args)

			if (res === false) {
				result = false
			}
		}

		return result
	}

	remove(event?: string): void {
		if (event) {
			delete this._items[event]
		} else {
			this._items = {}
		}
	}
}
