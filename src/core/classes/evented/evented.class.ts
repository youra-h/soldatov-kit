import { TEventEmitter, type TEventHandler } from '../../common/event-emitter'
import { TObject } from '../object'

export abstract class TEvented<
	TEvents extends Record<string, (...args: any) => any>,
> extends TObject {
	public events: TEventEmitter = new TEventEmitter()

	/**
	 * Подписка на событие
	 * @param event - имя события
	 * @param handler - обработчик события
	 */
	on(event: string, handler: TEventHandler): void {
		this.events.on(event, handler)
	}

	/**
	 * Отписка от события
	 * @param event - имя события
	 * @param handler - обработчик события
	 */
	off<K extends keyof TEvents>(event: K, handler: TEventHandler): void {
		this.events.off(event as string, handler)
	}

	/**
	 * Вызов события
	 * @param event - имя события
	 * @param args - аргументы события
	 */
	emit<K extends keyof TEvents>(event: K, ...args: Parameters<TEventHandler>): void {
		this.events.emit(event as string, ...args)
	}

	/**
	 * Выполняет событие и возвращает результат выполнения обработчиков
	 * @param event
	 * @param args
	 * @returns {boolean}
	 */
	emitWithResult<K extends keyof TEvents>(event: K, ...args: Parameters<TEventHandler>): boolean {
		return this.events.emitWithResult(event as string, ...args)
	}
}
