import { TInputControl } from '../../base/input-control'
import { TEvented } from '../../common/evented'
import type { IInput, IInputProps, TInputEvents } from './types'

export class TInput extends TInputControl<string, IInputProps, TInputEvents> implements IInput {
	static override baseClass = 's-input'

	static defaultValues: Partial<IInputProps> = {
		...TInputControl.defaultValues,
	}

	input(value: string, event?: Event): void {
		if (this.readonly || this.disabled) {
			event?.preventDefault()
			return
		}

		this.value = value
	}
}
