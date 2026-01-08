import type {
	IValueControl,
	IValueControlProps,
	TValueControlEvents,
	TValueControlStatesOptions,
} from '../value-control'
import type { IInputState, TControlInputState, TInputStateCtor } from '../states'

export type TInputControlEvents<T = string> = TValueControlEvents<T> & {
	'change:readonly': (value: boolean) => void
	'change:required': (value: boolean) => void
	'change:invalid': (value: boolean) => void
	'change:state': (value: TControlInputState) => void
	'change:loading': (value: boolean) => void
}

export interface IInputControlProps<T = string> extends IValueControlProps<T> {
	readonly?: boolean
	required?: boolean
	invalid?: boolean
	state?: TControlInputState
	loading?: boolean
}

export type TInputControlStatesOptions<T = string> = TValueControlStatesOptions<T> & {
	inputState?: TInputStateCtor | IInputState
}

export interface IInputControl<
	T,
	TProps extends IInputControlProps<T> = IInputControlProps<T>,
	TEvents extends Record<string, (...args: any) => any> = TInputControlEvents<T>,
> extends IValueControl<T, TProps, TEvents> {
	readonly: boolean
	required: boolean
	invalid: boolean
	state: TControlInputState
	loading: boolean
}

// Backward-compatible aliases for the common text-input case
export type ITextInputControlProps = IInputControlProps<string>
export type ITextInputControl<
	TProps extends ITextInputControlProps = ITextInputControlProps,
	TEvents extends Record<string, (...args: any) => any> = TInputControlEvents<string>,
> = IInputControl<string, TProps, TEvents>
