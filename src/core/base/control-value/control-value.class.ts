import { TComponent, type IComponentOptions } from '../component'
import { TControl } from '../control'
import type { IControlValue, IControlValueProps, TControlValueEvents } from './types'
import { TValueBehavior } from '../../classes/behavior/value.behavior'

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

	protected _valueBehavior: TValueBehavior<unknown>

	constructor(options: IComponentOptions<IControlValueProps> = {}) {
		options = TComponent.prepareOptions(options, 's-control-value')

		super(options)

		const { props = {} } = options

		this._valueBehavior = new TValueBehavior<unknown>(
			this,
			(props.value ?? TControlValue.defaultValues.value!) as unknown,
		)
	}

	get value(): unknown {
		return this._valueBehavior.value
	}

	set value(newValue: unknown) {
		this._valueBehavior.value = newValue
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			value: this._valueBehavior.value,
		}
	}
}
