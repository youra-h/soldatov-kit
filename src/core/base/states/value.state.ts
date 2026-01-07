import { TStateUnit } from '../state-unit'
import type { TEvented } from '../../common/evented'
import type { TStateCtor } from './types'

/**
 * События `TValueState`.
 */
export type TValueStateEvents<T> = {
	/**
	 * Срабатывает при "коммите" значения через сеттер `value`.
	 */
	change: (value: T) => void
	/**
	 * Срабатывает при вводе (без коммита), см. `input()`.
	 */
	input: (value: T) => void
}

export interface IValueState<T> {
	value: T
	readonly events: TEvented<TValueStateEvents<T>>
	input(value: T): void
}

export type TValueStateCtor<T> = TStateCtor<IValueState<T>, T>

/**
 * Единица состояния для значения контрола.
 *
 * Типичный сценарий:
 * - `value` (setter) — финальное изменение (change/commit)
 * - `input(value)` — промежуточное изменение (например, ввод в текстовом поле)
 */
export class TValueState<T> extends TStateUnit<TValueStateEvents<T>> implements IValueState<T> {
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
	 * Промежуточное изменение значения без семантики "коммита".
	 * Полезно для сценариев input vs change.
	 */
	input(value: T): void {
		this._value = value
		this.events.emit('input', value)
	}
}
