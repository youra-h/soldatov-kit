import { TEvented } from '../event/evented'
import type { TStateUnitValueEvents, IStateUnit } from './types'
import type { TValuePayload } from '../../bridge'

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

	/**
	 * Принудительно оповещает подписчиков, что resolved-значение могло измениться,
	 * даже если хранимое `_value` не менялось.
	 * Полезно когда резольвер зависит от внешних данных, которые изменились без прямой записи в этот state-unit.
	 */
	notify(): void {
		const resolved = this.value
		;(this.events as TEvented<TStateUnitValueEvents<TValue>>).emit('change', {
			newValue: resolved,
			oldValue: resolved,
		} as TValuePayload<TValue> as any)
	}

	get value(): TValue {
		return this._resolver ? this._resolver(this._value) : this._value
	}

	/** Хранимое значение без применения резольвера. */
	get rawValue(): TValue {
		return this._value
	}

	/** Текущий резольвер или undefined, если не задан. */
	get resolver(): ((value: TValue) => TValue) | undefined {
		return this._resolver
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
