export interface IBaseClassValueOptions<T extends string = string> {
	baseClass?: string
	exclude?: T[]
	value?: T
}

export abstract class TBaseClassValue<T extends string = string> {
	protected _baseClass: string
	protected _value: T
	protected _exclude: T[]
	private _onChangeHandlers: Array<(newValue: T, oldValue: T) => void> = []

	constructor(options: IBaseClassValueOptions<T> = {}) {
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
			this._onChangeHandlers.forEach((fn) => fn(newValue, oldValue))
		}
	}

	onChange(fn: (newValue: T, oldValue: T) => void): void {
		this._onChangeHandlers.push(fn)
	}

	abstract getClass(): string[]
}
