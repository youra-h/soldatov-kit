import { TComponent, type IComponentOptions } from './../component'
import { TControl, defaultValuesControl } from '../control'
import type { IControlValue, TControlValueEvents } from './types'
import type { TObjectProps } from '../object'

export const defaultValues: Partial<IControlValue> = {
	...defaultValuesControl,
	value: null,
}

export default class TControlValue<TEvents extends TControlValueEvents>
	extends TControl<TEvents>
	implements IControlValue
{
	/** Значение контрола */
	protected _value?: any

	constructor(options: IComponentOptions<IControlValue>) {
		options = TComponent.prepareOptions(options, 's-control-value')

		super(options)

		const { props = {} } = options

		this._value = props.value ?? defaultValues.value!
	}

	get value(): any {
		return this._value
	}

	set value(newValue: any) {
		if (this._value !== newValue) {
			this._value = newValue
			this.emit('changeValue', newValue)
		}
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			value: this._value,
		}
	}
}
