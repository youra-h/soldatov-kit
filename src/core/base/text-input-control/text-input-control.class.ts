import { TInputState } from '../states'
import { TValueControl } from '../value-control'
import type { ITextInputControlProps, TTextInputControlEvents } from './types'
import type { TControlInputState } from '../states'
import type { IPresentableOptions } from '../presentable'
import { TPresentable } from '../presentable'

/**
 * База для текстовых инпутов.
 *
 * Наследует:
 * - интерактивность (disabled/focused)
 * - значение `value: string` (commit + input)
 * - name
 *
 * Добавляет `TInputState` (readonly/required/invalid/state/loading).
 */
export default class TTextInputControl<
	TProps extends ITextInputControlProps = ITextInputControlProps,
	TEvents extends TTextInputControlEvents = TTextInputControlEvents,
> extends TValueControl<string, TProps, TEvents> {
	static defaultValues: Partial<ITextInputControlProps> = {
		...TValueControl.defaultValues,
		readonly: false,
		required: false,
		invalid: false,
		state: 'normal',
		loading: false,
	}

	protected _inputState: TInputState

	constructor(options: IPresentableOptions<TProps> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps> } = TPresentable.prepareOptions<TProps>(
			options as any,
		)

		this._inputState = new TInputState({
			readonly: props.readonly ?? (TTextInputControl.defaultValues.readonly as boolean),
			required: props.required ?? (TTextInputControl.defaultValues.required as boolean),
			invalid: props.invalid ?? (TTextInputControl.defaultValues.invalid as boolean),
			state: (props.state ?? TTextInputControl.defaultValues.state) as any,
			loading: props.loading ?? (TTextInputControl.defaultValues.loading as boolean),
		})

		this._inputState.events.on('change', (patch) => {
			if (patch.readonly !== undefined)
				this.events.emit('change:readonly' as any, patch.readonly)
			if (patch.required !== undefined)
				this.events.emit('change:required' as any, patch.required)
			if (patch.invalid !== undefined)
				this.events.emit('change:invalid' as any, patch.invalid)
			if (patch.state !== undefined) this.events.emit('change:state' as any, patch.state)
			if (patch.loading !== undefined)
				this.events.emit('change:loading' as any, patch.loading)
		})
	}

	get readonly(): boolean {
		return this._inputState.readonly
	}
	set readonly(value: boolean) {
		this._inputState.readonly = value
	}

	get required(): boolean {
		return this._inputState.required
	}
	set required(value: boolean) {
		this._inputState.required = value
	}

	get invalid(): boolean {
		return this._inputState.invalid
	}
	set invalid(value: boolean) {
		this._inputState.invalid = value
	}

	get state(): TControlInputState {
		return this._inputState.state
	}
	set state(value: TControlInputState) {
		this._inputState.state = value
	}

	get loading(): boolean {
		return this._inputState.loading
	}
	set loading(value: boolean) {
		this._inputState.loading = value
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			readonly: this._inputState.readonly,
			required: this._inputState.required,
			invalid: this._inputState.invalid,
			state: this._inputState.state as any,
			loading: this._inputState.loading,
		} as TProps
	}
}
