import { TStateUnit, type IStateUnit } from '../state-unit'

export interface IModifierValueOptions<TValue extends string = string> {
	baseClass?: string
	exclude?: TValue[]
	value?: TValue
}

export type IModifierValueState<TValue extends string = string> = IStateUnit<TValue> & {
	baseClass: string
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
	> extends TStateUnit<TValue> implements IModifierValueState<TValue> {
	protected _baseClass: string
	protected _exclude: TValue[]

	constructor(options: IModifierValueOptions<TValue> = {}) {
		super(options.value ?? ('normal' as TValue))
		this._baseClass = options.baseClass ?? 's-control'
		this._exclude = options.exclude ?? []
	}

	get baseClass(): string {
		return this._baseClass
	}

	set baseClass(value: string) {
		this._baseClass = value
	}

	abstract getClass(): string[]
}
