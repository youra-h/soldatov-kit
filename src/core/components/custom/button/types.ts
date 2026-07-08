import type {
	ITextable,
	ITextableProps,
	TTextableEvents,
	TTextableStates,
} from '../../base/textable'
import type { TComponentVariant } from '../../../bridge'

export type TButtonView = 'filled' | 'plain' | 'outlined' | 'none'

export interface IButtonProps extends ITextableProps {
	variant?: TComponentVariant
	view?: TButtonView
}

export type TButtonEvents = TTextableEvents & {
	'change:view': (value: TButtonView) => void
}

export type TButtonStates = TTextableStates

export interface IButton extends ITextable<IButtonProps, TButtonEvents> {
	view: TButtonView
}
