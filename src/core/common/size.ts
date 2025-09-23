import { TBaseClassValue, type IBaseClassValueOptions } from './base-class-value'

export type TSizeOptions<T extends string = string> = IBaseClassValueOptions<T>

export class TSize<T extends string = string> extends TBaseClassValue<T> {
	constructor(options: TSizeOptions<T> = {}) {
		super(options)
	}

	getClass(): string[] {
		return this.value && !this._exclude.includes(this.value)
			? [`${this._baseClass}--size-${this.value}`]
			: []
	}
}
