// Тип обработчика события
export type TEventHandler = (...args: any[]) => any
// Тип карты событий
export type TEventMap = Record<string, TEventHandler[]>

/**
 * Подписка на события
 * @example
 * const emitter = new TEventEmitter()
 * emitter.on('event', (data) => console.log(data))
 */
export class TEventEmitter {
	private _events: TEventMap = {}

	on(event: string, handler: TEventHandler): void {
		if (!this._events[event]) {
			this._events[event] = []
		}
		this._events[event].push(handler)
	}

	off(event: string, handler: TEventHandler): void {
		if (!this._events[event]) {
			return
		}

		this._events[event] = this._events[event].filter((h) => h !== handler)
	}

	emit(event: string, ...args: any[]): void {
		if (!this._events[event]) {
			return
		}

		this._events[event].forEach((handler) => handler(...args))
	}

	/**
	 * Выполняет событие и возвращает результат выполнения обработчиков
	 * @param event
	 * @param args
	 * @returns {boolean}
	 */
	emitWithResult(event: string, ...args: any[]): boolean {
		if (!this._events[event]) {
			return true
		}

		let result = true

		for (const handler of this._events[event]) {
			const res = handler(...args)

			if (res === false) {
				result = false
			}
		}

		return result
	}

	remove(event?: string): void {
		if (event) {
			delete this._events[event]
		} else {
			this._events = {}
		}
	}
}
