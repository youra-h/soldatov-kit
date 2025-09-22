import type { IControl, TControlEventsMap } from '../control'
import type { TVariant } from '../../common/types'

export type TButtonAppearance = 'normal' | 'plain' | 'outlined'

export interface IButton extends IControl {
	variant?: TVariant
	appearance?: TButtonAppearance
}

export type TButtonEventsMap = TControlEventsMap & {}
