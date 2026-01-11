import type { TComponentSize } from '../../common/types'
import { TStylableModifierState, type IStylableModifierStateOptions } from './stylable-modifier.state'

export type TSizeStateOptions = IStylableModifierStateOptions<TComponentSize>

export class TSizeState extends TStylableModifierState<TComponentSize> {
	constructor(options: TSizeStateOptions = {}) {
		super(options)
	}

	getClass(): string[] {
		return this.value && !this._exclude.includes(this.value)
			? [`${this._baseClass}--size-${this.value}`]
			: []
	}
}
