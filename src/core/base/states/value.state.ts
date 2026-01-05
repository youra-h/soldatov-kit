import { TStateUnit } from '../state-unit'

export type TValueStateEvents<T> = {
	change: (value: T) => void
	input: (value: T) => void
}

export class TValueState<T> extends TStateUnit<TValueStateEvents<T>> {
	private _value: T

	constructor(initial: T) {
		super()
		this._value = initial
	}

	get value(): T {
		return this._value
	}

	set value(value: T) {
		if (this._value === value) return

		this._value = value

		this.events.emit('change', value)
	}

	/**
	 * Опционально: событие ввода (input) без коммита.
	 * Может быть полезно для текстовых инпутов (input vs change).
	 */
	input(value: T): void {
		this._value = value
		this.events.emit('input', value)
	}
}
