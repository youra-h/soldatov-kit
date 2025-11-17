import { TEvented } from './evented'

export interface IBaseClassValueOptions<T extends string = string> {
	baseClass?: string
	exclude?: T[]
	value?: T
}

export type TBaseClassValueEvents<T extends string = string> = {
	change: (newValue: T, oldValue: T) => void
}

export abstract class TBaseClassValue<
	T extends string = string,
	TEvents extends TBaseClassValueEvents<T> = TBaseClassValueEvents<T>,
> {
	public readonly events: TEvented<TEvents>

	protected _baseClass: string
	protected _value: T
	protected _exclude: T[]

	constructor(options: IBaseClassValueOptions<T> = {}) {
		this.events = new TEvented<TEvents>()

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
			this.events.emit('change', newValue, oldValue)
		}
	}

	get baseClass(): string {
		return this._baseClass
	}

	set baseClass(value: string) {
		this._baseClass = value
	}

	abstract getClass(): string[]
}
