import type { TComponentVariant } from './types'

export interface TVariantOptions {
	baseClass?: string
	exclude?: TComponentVariant[]
	defaultValue?: TComponentVariant
}

export class TVariant {
	private _baseClass: string
	private _exclude: TComponentVariant[]
	private _value: TComponentVariant

	constructor(options: TVariantOptions = {}) {
		this._baseClass = options.baseClass ?? 's-control'
		this._value = options.defaultValue ?? 'normal'
		this._exclude = options.exclude ?? ['normal']
	}

	get value(): TComponentVariant {
		return this._value
	}
	set value(newValue: TComponentVariant) {
		this._value = newValue
	}

	getClass(): string[] {
		return this._value && !this._exclude.includes(this._value)
			? [`${this._baseClass}--${this._value}`]
			: []
	}
}
