import { type IComponentOptions } from '../component'
import { TControlInput } from '../control-input'
import type { ISwitch, TSwitchEvents } from './types'
import type { TObjectProps } from '../object'
import { TIcon } from '../icon'

export default class TSwitch<TEvents extends TSwitchEvents>
	extends TControlInput<TEvents>
	implements ISwitch
{
	static defaultValues: Partial<ISwitch> = {
		...TControlInput.defaultValues,
		value: false,
		variant: 'normal',
	}

	protected _value: boolean
	protected _icon?: TIcon

	constructor(options: IComponentOptions<ISwitch> = {}) {
		const { props = {}, baseClass = 's-switch' } = options

		super({ props, baseClass })

		this._value = props.value ?? TSwitch.defaultValues.value!
		this._icon = props.icon ?? TSwitch.defaultValues.icon!

		this._sizeHelper.on('change', (value) => {
			// Если есть спиннер, синхронизируем его размер с кнопкой
			this.spinner!.size = value

			if (this._icon) {
				this._icon.size = value
			}
		})
	}

	get value(): boolean {
		return this._value
	}

	set value(value: boolean) {
		if (this._value !== value) {
			this._value = value
			this.events.emit('changeValue', value)
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
			this.events.emit('change', {
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
