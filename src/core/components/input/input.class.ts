import { TInputControl } from '../../base/input-control'
import type { IInput, IInputProps, TInputEvents } from './types'

export class TInput extends TInputControl<string, IInputProps, TInputEvents> implements IInput {
	input(value: string): void {
		throw new Error('Method not implemented.')
	}
	static override baseClass = 's-input'

	static defaultValues: Partial<IInputProps> = {
		...TInputControl.defaultValues,
	}
}
