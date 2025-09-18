import type { IControl, TControlEventsMap } from '../control'
import type { TVariant } from '../utils/types'

export type TButtonAppearance = 'normal' | 'plain' | 'outlined' | 'label'

export interface IButton extends IControl {
	variant?: TVariant
	appearance?: TButtonAppearance
}

export type TButtonEventsMap = TControlEventsMap & {}
