import type {
	IInputControl,
	IInputControlProps,
	TInputControlEvents,
} from '../../base/input-control'

export interface IInputProps extends IInputControlProps<string> { }

export type TInputEvents = TInputControlEvents<string>

export interface IInput extends IInputControl<string, IInputProps, TInputEvents> {
	input(value: string, event?: Event): void
}
