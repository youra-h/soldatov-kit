import { TInputControl } from '../../base/input-control'
import type { IInput, IInputProps, TInputEvents } from './types'

export class TInput extends TInputControl<string, IInputProps, TInputEvents> implements IInput {
	static override baseClass = 's-input'

	static defaultValues: Partial<IInputProps> = {
		...TInputControl.defaultValues,
	}

	input(value: string): void {
		this.value = value
	}
}
