import { TComponent, type IComponentOptions } from '../component'
import type { IBaseControl, IBaseControlProps, TBaseControlEvents } from './types'
import { TDisableableBehavior } from '../behavior/disableable.behavior'

export default class TBaseControl<
		TProps extends IBaseControlProps = IBaseControlProps,
		TEvents extends TBaseControlEvents = TBaseControlEvents,
	>
	extends TComponent<TProps, TEvents>
	implements IBaseControl
{
	static defaultValues: Partial<IBaseControlProps> = {
		...TComponent.defaultValues,
		name: '',
		disabled: false,
	}

	/** Имя контрола */
	protected _name: string
	protected _disableable: TDisableableBehavior

	constructor(options: IComponentOptions<IBaseControlProps> = {}) {
		options = TComponent.prepareOptions(options, 's-base-control')

		super(options)

		const { props = {} } = options

		this._name = props.name ?? TBaseControl.defaultValues.name!
		this._disableable = new TDisableableBehavior(
			this,
			props.disabled ?? TBaseControl.defaultValues.disabled!,
		)
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
		return this._disableable.disabled
	}

	set disabled(value: boolean) {
		this._disableable.disabled = value
	}

	disable(): void {
		this.disabled = true
	}

	enable(): void {
		this.disabled = false
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			name: this._name,
			disabled: this._disableable.disabled,
		}
	}
}
