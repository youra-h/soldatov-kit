import type { IControl, TControlEventsMap } from '../control'
import type { TVariant } from '../../common/types'
import { TIcon } from '../icon'

export type TButtonAppearance = 'normal' | 'plain' | 'outlined'

export interface IButton extends IControl {
	variant?: TVariant
	appearance?: TButtonAppearance
	icon?: TIcon
}

export type TButtonEventsMap = TControlEventsMap & {}
