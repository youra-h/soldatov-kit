import { TObject } from '../classes/object'

export interface IBaseClassValueOptions<T extends string = string> {
	baseClass?: string
	exclude?: T[]
	value?: T
}

export type TBaseClassValueEventsMap<T extends string = string> = {
	change: (newValue: T, oldValue: T) => void
}

export abstract class TBaseClassValue<
	T extends string = string,
	E extends TBaseClassValueEventsMap<T> = TBaseClassValueEventsMap<T>,
> extends TObject<E> {
	protected _baseClass: string
	protected _value: T
	protected _exclude: T[]

	constructor(options: IBaseClassValueOptions<T> = {}) {
		super()

		this._baseClass = options.baseClass ?? 's-control'
		this._exclude = options.exclude ?? []
		this._value = options.value ?? ('normal' as T)
	}

	get value(): T {
		return this._value
	}
	set value(newValue: T) {
		if (this._value !== newValue) {
			const oldValue = this._value
			this._value = newValue
			this.emit('change', newValue, oldValue)
		}
	}

	abstract getClass(): string[]
}
