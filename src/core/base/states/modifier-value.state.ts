import { TStateUnit } from '../state-unit'
import type { TEvented } from '../../common/evented'

export interface IModifierValueOptions<T extends string = string> {
	baseClass?: string
	exclude?: T[]
	value?: T
}

export type TModifierValueEvents<T extends string = string> = {
	change: (newValue: T, oldValue: T) => void
}

export interface IModifierValueState<T extends string = string> {
	value: T
	baseClass: string
	readonly events: TEvented<TModifierValueEvents<T>>
	getClass(): string[]
}

export type TModifierValueStateCtor<
	T extends string = string,
	TState extends IModifierValueState<T> = IModifierValueState<T>,
> = new (options?: IModifierValueOptions<T>) => TState

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
	T extends string = string,
	TEvents extends TModifierValueEvents<T> = TModifierValueEvents<T>,
> extends TStateUnit<TEvents> implements IModifierValueState<T> {
	protected _baseClass: string
	protected _value: T
	protected _exclude: T[]

	constructor(options: IModifierValueOptions<T> = {}) {
		super()
		this._baseClass = options.baseClass ?? 's-control'
		this._exclude = options.exclude ?? []
		this._value = options.value ?? ('normal' as T)
	}

	get value(): T {
		return this._value
	}
	set value(newValue: T) {
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
