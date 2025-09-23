import type { TComponentVariant } from './types'
import { TBaseClassValue, type IBaseClassValueOptions } from './base-class-value'

export type TVariantOptions = IBaseClassValueOptions<TComponentVariant>

export class TVariant extends TBaseClassValue<TComponentVariant> {
	constructor(options: TVariantOptions = {}) {
		super(options)
	}

	getClass(): string[] {
		return this.value && !this._exclude.includes(this.value)
			? [`${this._baseClass}--${this.value}`]
			: []
	}
}
