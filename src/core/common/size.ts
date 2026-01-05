import { TSizeState } from '../base/states/size.state'
import type { TSizeStateOptions } from '../base/states/size.state'
import type { TComponentSize } from './types'

export type TSizeOptions = TSizeStateOptions

export class TSize extends TSizeState {
	constructor(options: TSizeOptions = {}) {
		super(options)
	}
}
