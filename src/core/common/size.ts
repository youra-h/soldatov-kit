import type { TControlSize } from './types'

export interface TSizeOptions {
	baseClass?: string
	exclude?: TControlSize[]
	defaultValue?: TControlSize
}

export class TSize {
	private _baseClass: string
	private _value: TControlSize = 'normal'
	private _exclude: TControlSize[]

	constructor(options: TSizeOptions = {}) {
		this._baseClass = options.baseClass ?? 's-control'
		this._exclude = options.exclude ?? ['normal']
		this._value = options.defaultValue ?? 'normal'
	}

	get value(): TControlSize {
		return this._value
	}
	set value(newValue: TControlSize) {
		this._value = newValue
	}

	getClass(): string[] {
		return this._value && !this._exclude.includes(this._value)
			? [`${this._baseClass}--size-${this._value}`]
			: []
	}
}
