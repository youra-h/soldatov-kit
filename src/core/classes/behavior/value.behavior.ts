import type { TEvented } from '../../common/evented'

type TValueHost = { events: TEvented<any> }

/**
 * Поведение "value" без собственного event-emitter.
 *
 * Эмитит через `host.events`:
 * - `change:value`
 * - `changeValue` (legacy)
 */
export class TValueBehavior<T> {
	private _host: TValueHost
	private _value: T

	constructor(host: TValueHost, initialValue: T) {
		this._host = host
		this._value = initialValue
	}

	get value(): T {
		return this._value
	}

	set value(value: T) {
		if (this._value === value) return

		this._value = value
		;(this._host.events as any).emit('change:value', value)
		;(this._host.events as any).emit('changeValue', value)
	}

	/**
	 * Опционально: событие ввода (input) без коммита.
	 * Может быть полезно для текстовых инпутов (input vs change).
	 */
	input(value: T): void {
		this._value = value
		;(this._host.events as any).emit('input:value', value)
	}
}
