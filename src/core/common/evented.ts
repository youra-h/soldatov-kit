import { TEventEmitter, type TEventHandler } from './event-emitter'
import { TObject } from '../classes/object'

export class TEvented<TEvents extends Record<string, (...args: any) => any>> extends TObject {
	private _items: TEventEmitter = new TEventEmitter()

	/**
	 * Подписка на событие
	 * @param event - имя события
	 * @param handler - обработчик события
	 */
	on<K extends keyof TEvents>(event: K, handler: TEvents[K]): void {
		this._items.on(event as string, handler as TEventHandler)
	}

	/**
	 * Отписка от события
	 * @param event - имя события
	 * @param handler - обработчик события
	 */
	off<K extends keyof TEvents>(event: K, handler: TEventHandler): void {
		this._items.off(event as string, handler)
	}

	/**
	 * Вызов события
	 * @param event - имя события
	 * @param args - аргументы события
	 */
	emit<K extends keyof TEvents>(event: K, ...args: Parameters<TEventHandler>): void {
		this._items.emit(event as string, ...args)
	}

	/**
	 * Выполняет событие и возвращает результат выполнения обработчиков
	 * @param event
	 * @param args
	 * @returns {boolean}
	 */
	emitWithResult<K extends keyof TEvents>(event: K, ...args: Parameters<TEventHandler>): boolean {
		return this._items.emitWithResult(event as string, ...args)
	}
}
