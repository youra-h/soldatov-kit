import type {
	ITextable,
	ITextableProps,
	TTextableEvents,
	TTextableStatesOptions,
} from '../../base/textable'
import type { TComponentVariant } from '../../common/types'

export type TButtonAppearance = 'filled' | 'plain' | 'outlined' | 'none'

export interface IButtonProps extends ITextableProps {
	variant?: TComponentVariant
	appearance?: TButtonAppearance
}

export type TButtonEvents = TTextableEvents & {
	'change:appearance': (value: TButtonAppearance) => void
}

export type TButtonStatesOptions = TTextableStatesOptions

export interface IButton extends ITextable<IButtonProps, TButtonEvents> {
	appearance: TButtonAppearance
}
