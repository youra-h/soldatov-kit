import type { TComponentSize } from '../../common/types'
import { TModifierValue, type IModifierValueOptions } from './modifier-value.state'

export type TSizeStateOptions = IModifierValueOptions<TComponentSize>

export class TSizeState extends TModifierValue<TComponentSize> {
	constructor(options: TSizeStateOptions = {}) {
		super(options)
	}

	getClass(): string[] {
		return this.value && !this._exclude.includes(this.value)
			? [`${this._baseClass}--size-${this.value}`]
			: []
	}
}
