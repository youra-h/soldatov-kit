export interface TSizeOptions<T extends string = string> {
	baseClass?: string
	exclude?: T[]
	defaultValue?: T
}

export class TSize<T extends string = string> {
	private _baseClass: string
	private _value: T = 'normal' as T
	private _exclude: T[]

	constructor(options: TSizeOptions<T> = {}) {
		this._baseClass = options.baseClass ?? 's-control'
		this._exclude = options.exclude ?? ['normal' as T]
		this._value = options.defaultValue !== undefined ? options.defaultValue : ('normal' as T)
	}

	get value(): T {
		return this._value
	}
	set value(newValue: T) {
		this._value = newValue
	}

	getClass(): string[] {
		return this._value && !this._exclude.includes(this._value)
			? [`${this._baseClass}--size-${this._value}`]
			: []
	}
}
