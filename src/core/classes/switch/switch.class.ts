import { type IComponentOptions } from '../component'
import { TControlInput, defaultValuesControlInput } from '../control-input'
import type { ISwitch, TSwitchEventsMap } from './types'
import type { TObjectProps } from '../object'
import { TIcon } from '../icon'

export const defaultValues: Partial<ISwitch> = {
	...defaultValuesControlInput,
	value: false,
	variant: 'normal',
}

export default class TSwitch<TEvents extends TSwitchEventsMap>
	extends TControlInput<TEvents>
	implements ISwitch
{
	protected _value: boolean
	protected _icon?: TIcon

	constructor(options: IComponentOptions<ISwitch>) {
		const { props = {}, baseClass = 's-switch' } = options

		super({ props, baseClass })

		this._value = props.value ?? defaultValues.value!
		this._icon = props.icon ?? defaultValues.icon!
	}

	get value(): boolean {
		return this._value
	}

	set value(value: boolean) {
		if (this._value !== value) {
			this._value = value
			this.emit('changeValue', value)
		}
	}

	get icon(): TIcon | undefined {
		return this._icon
	}

	set icon(value: TIcon | undefined) {
		if (this._icon !== value) {
			this._icon = value ? TIcon.getInstance(value) : undefined

			if (this._icon) {
				this._icon.size = this.size
			}
		}
	}

	get classes(): string[] {
		const classes = [...super.classes]

		return classes
	}

	/**
	 * Переключает состояние компонента
	 * Если было true, то станет false
	 */
	change(event?: Event) {
		const oldValue = this._value

		this.value = this.value === true ? false : true

		if (oldValue !== this._value) {
			this.emit('change', {
				event,
				value: this._value,
			})
		}
	}

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			icon: this.icon,
		}
	}
}
