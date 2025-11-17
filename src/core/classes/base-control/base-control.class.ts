import { TComponent, type IComponentOptions } from '../component'
import type { IBaseControlProps, TBaseControlEvents } from './types'

export default class TBaseControl<
		TProps extends IBaseControlProps = IBaseControlProps,
		TEvents extends TBaseControlEvents = TBaseControlEvents,
	>
	extends TComponent<TProps, TEvents>
	implements IBaseControlProps
{
	static defaultValues: Partial<IBaseControlProps> = {
		...TComponent.defaultValues,
		name: '',
		disabled: false,
	}

	/** Имя контрола */
	protected _name: string
	/** Заблокирован ли контрол */
	protected _disabled: boolean

	constructor(options: IComponentOptions<IBaseControlProps> = {}) {
		options = TComponent.prepareOptions(options, 's-base-control')

		super(options)

		const { props = {} } = options

		this._name = props.name ?? TBaseControl.defaultValues.name!
		this._disabled = props.disabled ?? TBaseControl.defaultValues.disabled!
	}

	get name(): string {
		return this._name && this._name !== '' ? this._name : this._id.toString()
	}

	set name(value: string) {
		if (this._name !== value) {
			this._name = value
		}
	}

	get disabled(): boolean {
		return this._disabled
	}

	set disabled(value: boolean) {
		if (this._disabled !== value) {
			this._disabled = value
			this.events.emit('disabled', value)
		}
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			name: this._name,
			disabled: this._disabled,
		}
	}
}
