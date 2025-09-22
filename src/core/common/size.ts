import type { TControlSize } from './types'

export class TSize {
	private _baseClass: string
	private _value: TControlSize = 'normal'

	constructor(baseClass: string) {
		this._baseClass = baseClass
	}

	get value(): TControlSize {
		return this._value
	}
	set value(newValue: TControlSize) {
		this._value = newValue
	}

	getClass(): string[] {
		return this._value && this._value !== 'normal'
			? [`${this._baseClass}--size-${this._value}`]
			: []
	}
}
