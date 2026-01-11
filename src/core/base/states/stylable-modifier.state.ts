import { TStateUnit, type IStateUnit } from '../state-unit'

/**
 * Опции для создания CSS-модификатора состояния.
 */
export interface IStylableModifierStateOptions<TValue extends string = string> {
	/** Базовый CSS-класс компонента */
	baseClass?: string
	/** Значения модификатора, которые нужно исключить из генерации классов */
	exclude?: TValue[]
	/** Начальное значение модификатора */
	value?: TValue
}

/**
 * Интерфейс состояния CSS-модификатора.
 * Расширяет базовый IStateUnit методом для генерации CSS-классов.
 */
export interface IStylableModifierState<TValue extends string = string> extends IStateUnit<TValue> {
	/** Базовый CSS-класс компонента */
	baseClass: string
	/** Генерирует массив CSS-классов на основе текущего значения */
	getClass(): string[]
}

/**
 * Базовое состояние для CSS-модификатора.
 *
 * Используется для унифицированных сущностей вроде `size` и `variant`,
 * которые преобразуют значение (например, 'large') в CSS-класс
 * (например, 's-control--size-large').
 *
 * Правила:
 * - `value` — текущее значение модификатора
 * - `baseClass` — базовый CSS-класс компонента, от которого строятся модификаторы
 * - `exclude` — список значений, для которых не нужно генерировать классы
 */
export abstract class TStylableModifierState<
	TValue extends string = string,
	> extends TStateUnit<TValue> implements IStylableModifierState<TValue> {
	protected _baseClass: string
	protected _exclude: TValue[]

	constructor(options: IStylableModifierStateOptions<TValue> = {}) {
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
