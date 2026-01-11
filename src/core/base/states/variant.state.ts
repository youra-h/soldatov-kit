import type { TComponentVariant } from '../../common/types'
import { TStylableModifierState, type IStylableModifierStateOptions } from './stylable-modifier.state'

export type TVariantStateOptions = IStylableModifierStateOptions<TComponentVariant>

export class TVariantState extends TStylableModifierState<TComponentVariant> {
	constructor(options: TVariantStateOptions = {}) {
		super(options)
	}

	getClass(): string[] {
		return this.value && !this._exclude.includes(this.value)
			? [`${this._baseClass}--${this.value}`]
			: []
	}
}
