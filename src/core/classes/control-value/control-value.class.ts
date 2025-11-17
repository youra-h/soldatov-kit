import { TComponent, type IComponentOptions } from './../component'
import { TControl } from '../control'
import type { IControlValue, IControlValueProps, TControlValueEvents } from './types'

export default class TControlValue<
		TProps extends IControlValueProps = IControlValueProps,
		TEvents extends TControlValueEvents = TControlValueEvents,
	>
	extends TControl<TProps, TEvents>
	implements IControlValue
{
	static defaultValues: Partial<IControlValueProps> = {
		...TControl.defaultValues,
		value: null,
	}

	/** Значение контрола */
	protected _value?: any

	constructor(options: IComponentOptions<IControlValueProps> = {}) {
		options = TComponent.prepareOptions(options, 's-control-value')

		super(options)

		const { props = {} } = options

		this._value = props.value ?? TControlValue.defaultValues.value!
	}

	get value(): any {
		return this._value
	}

	set value(newValue: any) {
		if (this._value !== newValue) {
			this._value = newValue
			this.events.emit('changeValue', newValue)
		}
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			value: this._value,
		}
	}
}
