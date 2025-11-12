import { TComponent, type IComponentOptions } from '../component'
import type { IBaseControl, TBaseControlEvents } from './types'
import type { TObjectProps } from '../object'

export default class TBaseControl<TEvents extends TBaseControlEvents>
	extends TComponent<TEvents>
	implements IBaseControl
{
	static defaultValues: Partial<IBaseControl> = {
		...TComponent.defaultValues,
		name: '',
		disabled: false,
	}

	/** Имя контрола */
	protected _name: string
	/** Заблокирован ли контрол */
	protected _disabled: boolean

	constructor(options: IComponentOptions<IBaseControl> = {}) {
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
			this.emit('disabled', value)
		}
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			name: this._name,
			disabled: this._disabled,
		}
	}
}
