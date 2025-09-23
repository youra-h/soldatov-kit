import { type IComponentOptions } from './../component'
import { TControl, defaultControlValues } from '../control'
import type { IControlValue, TControlValueEventsMap } from './types'
import type { TObjectProps } from '../object'

export const defaultValues: Partial<IControlValue> = {
	...defaultControlValues,
	value: null,
}

export default class TControlValue<TEvents extends TControlValueEventsMap>
	extends TControl<TEvents>
	implements IControlValue
{
	protected _value: any

	constructor(
		options: IComponentOptions<IControlValue> = { props: {}, baseClass: 's-control-value' },
	) {
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
