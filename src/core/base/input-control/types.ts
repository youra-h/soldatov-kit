import type {
	IValueControl,
	IValueControlProps,
	TValueControlEvents,
	TValueControlStatesOptions,
} from '../value-control'

export type TInputControlState = 'normal' | 'success' | 'warning' | 'error'

export type TInputControlEvents<T = string> = TValueControlEvents<T> & {
	'change:readonly': (value: boolean) => void
	'change:required': (value: boolean) => void
	'change:invalid': (value: boolean) => void
	'change:state': (value: TInputControlState) => void
}

export interface IInputControlProps<T = string> extends IValueControlProps<T> {
	readonly?: boolean
	required?: boolean
	invalid?: boolean
	state?: TInputControlState
}

export type TInputControlStatesOptions<TValue = string> = TValueControlStatesOptions<TValue>

export interface IInputControl<
	T,
	TProps extends IInputControlProps<T> = IInputControlProps<T>,
	TEvents extends Record<string, (...args: any) => any> = TInputControlEvents<T>,
> extends IValueControl<T, TProps, TEvents> {
	readonly: boolean
	required: boolean
	invalid: boolean
	state: TInputControlState
}

// Backward-compatible aliases for the common text-input case
export type ITextInputControlProps = IInputControlProps<string>
export type ITextInputControl<
	TProps extends ITextInputControlProps = ITextInputControlProps,
	TEvents extends Record<string, (...args: any) => any> = TInputControlEvents<string>,
> = IInputControl<string, TProps, TEvents>
