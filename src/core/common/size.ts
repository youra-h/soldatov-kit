import { TBaseClassValue, type IBaseClassValueOptions } from './base-class-value'
import type { TComponentSize } from './types'

export type TSizeOptions = IBaseClassValueOptions<TComponentSize>

export class TSize extends TBaseClassValue<TComponentSize> {
	constructor(options: TSizeOptions = {}) {
		super(options)
	}

	getClass(): string[] {
		return this.value && !this._exclude.includes(this.value)
			? [`${this._baseClass}--size-${this.value}`]
			: []
	}
}
