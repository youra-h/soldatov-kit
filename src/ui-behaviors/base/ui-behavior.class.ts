import { TEvented } from '../../core/common/evented'
import type { IUiBehavior, TUiBehaviorEvents } from './types'

/**
 * Базовый класс ui-поведений.
 *
 * Отвечает за:
 * - управление DOM-элементом (el getter/setter)
 * - эмит событий mount / unmount / ready
 * - базовый жизненный цикл (requestAnimationFrame для ready)
 *
 * Наследники реализуют конкретную логику работы с DOM,
 * подписываясь на события core-инстанса в конструкторе.
 */
export abstract class TUiBehavior implements IUiBehavior {
	readonly events: TEvented<TUiBehaviorEvents> = new TEvented<TUiBehaviorEvents>()

	private _el: Element | null = null
	private _ready: boolean = false

	get el(): Element | null {
		return this._el
	}

	set el(value: Element | null) {
		if (this._el === value) return

		const prev = this._el
		this._el = value

		if (value && !prev) {
			this._ready = false
			this.events.emit('mount', { el: value })

			requestAnimationFrame(() => {
				this._ready = true
				this.events.emit('ready')
			})
		} else if (!value && prev) {
			this._ready = false
			this.events.emit('unmount')
		}
	}

	get ready(): boolean {
		return this._ready
	}

	abstract free(): void
}
