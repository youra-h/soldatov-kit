import { TComponent, type IComponentOptions } from '../component'
import { TControl, defaultValuesControl } from '../control'
import type { IControlInput, TControlInputEventsMap, TControlInputState } from './types'
import type { TObjectProps } from '../object'

export const defaultValues: Partial<IControlInput> = {
	...defaultValuesControl,
	readonly: false,
	required: false,
	invalid: false,
	state: 'normal',
}

export default class TControlInput<TEvents extends TControlInputEventsMap>
	extends TControl<TEvents>
	implements IControlInput
{
	protected _readonly: boolean
	protected _required: boolean
	protected _invalid: boolean
	protected _state: TControlInputState

	constructor(options: IComponentOptions<IControlInput>) {
		options = TComponent.prepareOptions(options, 's-control-input')

		super(options)

		const { props = {} } = options

		this._readonly = props.readonly ?? defaultValues.readonly!
		this._required = props.required ?? defaultValues.required!
		this._invalid = props.invalid ?? defaultValues.invalid!
		this._state = props.state ?? defaultValues.state!
	}
	value: any
	is?: Object | undefined

	get readonly(): boolean {
		return this._readonly
	}

	set readonly(value: boolean) {
		if (this._readonly !== value) {
			this._readonly = value
		}
	}

	get required(): boolean {
		return this._required
	}

	set required(value: boolean) {
		if (this._required !== value) {
			this._required = value
		}
	}

	get invalid(): boolean {
		return this._invalid
	}

	set invalid(value: boolean) {
		if (this._invalid !== value) {
			this._invalid = value

			if (value) {
				this.state = 'error'
			}
		}
	}

	get state(): TControlInputState {
		return this._state
	}

	set state(value: TControlInputState) {
		if (this._state !== value) {
			this._state = value
		}
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			readonly: this.readonly,
			required: this.required,
			invalid: this.invalid,
			state: this.state,
		}
	}
}
