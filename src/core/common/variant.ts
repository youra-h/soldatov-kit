import { TVariantState } from '../base/states/variant.state'
import type { TVariantStateOptions } from '../base/states/variant.state'
import type { TComponentVariant } from './types'

export type TVariantOptions = TVariantStateOptions

export class TVariant extends TVariantState {
	constructor(options: TVariantOptions = {}) {
		super(options)
	}
}
