import { TInputState, type IInputState, type IInputStateProps } from '../states'
import { TValueControl } from '../value-control'
import type { IInputControlProps, TInputControlEvents, TInputControlStatesOptions } from './types'
import type { TControlInputState } from '../states'
import type { IComponentViewOptions } from '../component-view'
import { TComponentView } from '../component-view'
import { resolveState } from '../../common/resolve-state'

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
export default class TInputControl<
	TValue = string,
	TProps extends IInputControlProps<TValue> = IInputControlProps<TValue>,
	TEvents extends TInputControlEvents<TValue> = TInputControlEvents<TValue>,
	TStates extends TInputControlStatesOptions<TValue> = TInputControlStatesOptions<TValue>,
> extends TValueControl<TValue, TProps, TEvents> {
	static defaultValues: Partial<IInputControlProps<any>> = {
		...TValueControl.defaultValues,
		readonly: false,
		required: false,
		invalid: false,
		state: 'normal',
		loading: false,
	}

	protected _inputState: IInputState

	constructor(options: IComponentViewOptions<TProps, TStates> | Partial<TProps> = {}) {
		super(options)

		const { props = {} as Partial<TProps>, states } = TComponentView.prepareOptions<
			TProps,
			TStates
		>(options)

		const readonly = props.readonly ?? (TInputControl.defaultValues.readonly as boolean)
		const required = props.required ?? (TInputControl.defaultValues.required as boolean)
		const invalid = props.invalid ?? (TInputControl.defaultValues.invalid as boolean)
		const state = props.state ?? (TInputControl.defaultValues.state as TControlInputState)
		const loading = props.loading ?? (TInputControl.defaultValues.loading as boolean)

		this._inputState = resolveState<IInputState, Partial<IInputStateProps>>(
			states?.inputState,
			TInputState,
			{
				readonly,
				required,
				invalid,
				state,
				loading,
			},
		)

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
		return this._inputState.readonly!
	}
	set readonly(value: boolean) {
		this._inputState.readonly = value
	}

	get required(): boolean {
		return this._inputState.required!
	}
	set required(value: boolean) {
		this._inputState.required = value
	}

	get invalid(): boolean {
		return this._inputState.invalid!
	}
	set invalid(value: boolean) {
		this._inputState.invalid = value
	}

	get state(): TControlInputState {
		return this._inputState.state!
	}
	set state(value: TControlInputState) {
		this._inputState.state = value
	}

	get loading(): boolean {
		return this._inputState.loading!
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
