import { TEventEmitter, type TEventHandler } from '../utils/event-emitter'
import type { TObjectProps } from './types'

export abstract class TObject<TEvents extends Record<string, TEventHandler>> {
	public events: TEventEmitter

	constructor() {
		this.events = new TEventEmitter()
	}

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

	getProps(): TObjectProps {
		return {}
	}
}
