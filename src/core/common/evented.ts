import { TEventEmitter, type TEventHandler } from './event-emitter'
import { TEntity } from '../base/entity'

export class TEvented<TEvents extends Record<string, (...args: any) => any>> extends TEntity {
	private _items: TEventEmitter<TEvents> = new TEventEmitter()

	/**
	 * Подписка на событие
	 * @param event - имя события
	 * @param handler - обработчик события
	 */
	on<K extends keyof TEvents>(event: K, handler: TEvents[K]): void {
		this._items.on(event, handler)
	}

	/**
	 * Отписка от события
	 * @param event - имя события
	 * @param handler - обработчик события
	 */
	off<K extends keyof TEvents>(event: K, handler: TEvents[K]): void {
		this._items.off(event, handler)
	}

	/**
	 * Вызов события
	 * @param event - имя события
	 * @param args - аргументы события
	 */
	emit<K extends keyof TEvents>(event: K, ...args: Parameters<TEvents[K]>): void {
		this._items.emit(event, ...args)
	}

	/**
	 * Выполняет событие и возвращает результат выполнения обработчиков
	 * @param event
	 * @param args
	 * @returns {boolean}
	 */
	emitWithResult<K extends keyof TEvents>(event: K, ...args: Parameters<TEvents[K]>): boolean {
		return this._items.emitWithResult(event, ...args)
	}

	/**
	 * Выполняет событие и возвращает первый не-undefined результат (short-circuit).
	 */
	emitResolve<T, K extends keyof TEvents>(
		event: K,
		...args: Parameters<TEvents[K]>
	): T | undefined {
		return this._items.emitResolve<T, K>(event, ...args)
	}

	/**
	 * Выполняет событие и возвращает все не-undefined результаты обработчиков.
	 */
	emitResolveAll<T, K extends keyof TEvents>(event: K, ...args: Parameters<TEvents[K]>): T[] {
		return this._items.emitResolveAll<T, K>(event, ...args)
	}
}
