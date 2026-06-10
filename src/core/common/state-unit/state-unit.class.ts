import { TEvented } from '../evented'
import type { TStateUnitValueEvents, IStateUnit } from './types'
import type { TValuePayload } from '../types'

/**
 * Универсальная единица состояния со значением.
 *
 * Через `resolver` можно задать функцию-преобразователь,
 * которая будет вызываться при чтении `value`.
 * Если резольвер не задан — возвращается хранимое значение как есть.
 */
export class TStateUnit<
	TValue,
	TEvents extends TStateUnitValueEvents<TValue> = TStateUnitValueEvents<TValue>,
> implements IStateUnit<TValue, TEvents> {
	public readonly events: TEvented<TEvents>
	protected _value: TValue
	private _resolver?: (value: TValue) => TValue

	constructor({ initial, resolver }: { initial: TValue; resolver?: (value: TValue) => TValue }) {
		this.events = new TEvented<TEvents>()
		this._value = initial
		this._resolver = resolver
	}

	/**
	 * Установить резольвер — функцию, которая преобразует хранимое значение при чтении.
	 * Передайте `undefined` чтобы сбросить.
	 *
	 * @example
	 * state.setResolver((current) => current ?? getDefault() ?? false)
	 */
	setResolver(resolver: ((value: TValue) => TValue) | undefined): void {
		this._resolver = resolver
	}

	get value(): TValue {
		return this._resolver ? this._resolver(this._value) : this._value
	}

	set value(value: TValue) {
		if (this._value === value) return

		const oldValue = this._value
		this._value = value
		;(this.events as TEvented<TStateUnitValueEvents<TValue>>).emit('change', {
			newValue: value,
			oldValue,
		} as TValuePayload<TValue> as any)
	}
}
