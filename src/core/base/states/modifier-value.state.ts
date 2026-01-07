import { TStateUnit } from '../state-unit'
import type { TEvented } from '../../common/evented'

export interface IModifierValueOptions<TValue extends string = string> {
	baseClass?: string
	exclude?: TValue[]
	value?: TValue
}

export type TModifierValueEvents<TValue extends string = string> = {
	change: (newValue: TValue, oldValue: TValue) => void
}

export interface IModifierValueState<TValue extends string = string> {
	value: TValue
	baseClass: string
	readonly events: TEvented<TModifierValueEvents<TValue>>
	getClass(): string[]
}

export type TModifierValueStateCtor<
	TValue extends string = string,
	TState extends IModifierValueState<TValue> = IModifierValueState<TValue>,
> = new (options?: IModifierValueOptions<TValue>) => TState

/**
 * Базовый state для строкового модификатора CSS-класса.
 *
 * Используется для унифицированных сущностей вроде `size` и `variant`.
 *
 * Правило:
 * - `value` — текущее значение модификатора
 * - `baseClass` — базовый CSS-класс компонента, от которого строятся модификаторы
 */
export abstract class TModifierValue<
	TValue extends string = string,
	TEvents extends TModifierValueEvents<TValue> = TModifierValueEvents<TValue>,
> extends TStateUnit<TEvents> implements IModifierValueState<TValue> {
	protected _baseClass: string
	protected _value: TValue
	protected _exclude: TValue[]

	constructor(options: IModifierValueOptions<TValue> = {}) {
		super()
		this._baseClass = options.baseClass ?? 's-control'
		this._exclude = options.exclude ?? []
		this._value = options.value ?? ('normal' as TValue)
	}

	get value(): TValue {
		return this._value
	}
	set value(newValue: TValue) {
		if (this._value === newValue) return

		const oldValue = this._value
		this._value = newValue
		this.events.emit('change', newValue, oldValue)
	}

	get baseClass(): string {
		return this._baseClass
	}

	set baseClass(value: string) {
		this._baseClass = value
	}

	abstract getClass(): string[]
}
