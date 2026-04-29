import { TEvented } from '../../core/common/evented'
import type { IUiSync, IUiSyncHandler, TUiSyncEvents } from './types'

/**
 * Базовый координатор DOM-синхронизации.
 *
 * Владеет el и списком обработчиков. При установке el через сеттер:
 * - вызывает mount() у всех обработчиков после requestAnimationFrame
 * - эмитит событие mount для внешних наблюдателей
 * - вызывает unmount() у всех обработчиков немедленно при удалении el
 *
 * Наследники регистрируют обработчики через protected use() в конструкторе.
 */
export abstract class TUiSync implements IUiSync {
	readonly events: TEvented<TUiSyncEvents> = new TEvented<TUiSyncEvents>()

	private _handlers: IUiSyncHandler[] = []
	private _el: Element | null = null

	get el(): Element | null {
		return this._el
	}

	protected use(handler: IUiSyncHandler): void {
		this._handlers.push(handler)
	}

	set el(value: Element | null) {
		if (this._el === value) return
		const prev = this._el
		this._el = value

		if (value && !prev) {
			requestAnimationFrame(() => {
				if (this._el !== value) return
				this._handlers.forEach((h) => h.mount(value))
				this.events.emit('mount', value)
			})
		} else if (!value && prev) {
			this._handlers.forEach((h) => h.unmount())
			this.events.emit('unmount')
		}
	}

	free(): void {
		this._handlers.forEach((h) => h.free())
		this._handlers = []
	}
}
