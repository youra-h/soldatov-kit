import type { TComponentVariant } from '../../common/types'
import { TModifierValue, type IModifierValueOptions } from './modifier-value.state'

export type TVariantStateOptions = IModifierValueOptions<TComponentVariant>

export class TVariantState extends TModifierValue<TComponentVariant> {
	constructor(options: TVariantStateOptions = {}) {
		super(options)
	}

	getClass(): string[] {
		return this.value && !this._exclude.includes(this.value)
			? [`${this._baseClass}--${this.value}`]
			: []
	}
}
