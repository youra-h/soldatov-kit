import type { IValueControl, IValueControlProps, TValueControlEvents } from '../value-control'
import type { TControlInputState } from '../states'

export type TTextInputControlEvents = TValueControlEvents<string> & {
	'change:readonly': (value: boolean) => void
	'change:required': (value: boolean) => void
	'change:invalid': (value: boolean) => void
	'change:state': (value: TControlInputState) => void
	'change:loading': (value: boolean) => void
}

export interface ITextInputControlProps extends IValueControlProps<string> {
	readonly?: boolean
	required?: boolean
	invalid?: boolean
	state?: TControlInputState
	loading?: boolean
}

export interface ITextInputControl<
	TProps extends ITextInputControlProps = ITextInputControlProps,
	TEvents extends Record<string, (...args: any) => any> = TTextInputControlEvents,
> extends IValueControl<string, TProps, TEvents> {
	readonly: boolean
	required: boolean
	invalid: boolean
	state: TControlInputState
	loading: boolean
}
