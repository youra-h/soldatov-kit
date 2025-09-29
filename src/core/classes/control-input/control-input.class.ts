import { TComponent, type IComponentOptions } from '../component'
import type { TComponentVariant } from '../../common/types'
import { TControlValue, defaultValuesControlValue } from '../control-value'
import type { IControlInput, TControlInputEventsMap, TControlInputState } from './types'
import type { TObjectProps } from '../object'
import { TVariant } from '../../common/variant'

export const defaultValues: Partial<IControlInput> = {
	...defaultValuesControlValue,
	variant: 'normal',
	readonly: false,
	required: false,
	invalid: false,
	state: 'normal',
}

export default class TControlInput<TEvents extends TControlInputEventsMap>
	extends TControlValue<TEvents>
	implements IControlInput
{
	protected _variantHelper: TVariant

	protected _readonly: boolean
	protected _required: boolean
	protected _invalid: boolean
	protected _state: TControlInputState

	constructor(options: IComponentOptions<IControlInput>) {
		options = TComponent.prepareOptions(options, 's-control-input')

		super(options)

		const { props = {} } = options

		this._variantHelper = new TVariant({
			baseClass: this._baseClass,
		})

		// Инициализируем значение отображения компонента
		this._variantHelper.value = props.variant ?? defaultValues.variant!

		this._readonly = props.readonly ?? defaultValues.readonly!
		this._required = props.required ?? defaultValues.required!
		this._invalid = props.invalid ?? defaultValues.invalid!
		this._state = props.state ?? defaultValues.state!
	}

	get variant(): TComponentVariant {
		return this._variantHelper.value
	}

	set variant(value: TComponentVariant) {
		if (this._variantHelper.value !== value) {
			this._variantHelper.value = value
		}
	}

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
