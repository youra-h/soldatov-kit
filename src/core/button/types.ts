import type { IControl, TControlEventsMap } from '../control'
import type { TVariant } from '../utils/types'

export type TButtonAppearance = 'outlined' | 'plain' | 'filled' | 'label'

export interface IButton extends IControl {
	variant?: TVariant
	appearance?: TButtonAppearance
}

export type TButtonEventsMap = TControlEventsMap & {}
