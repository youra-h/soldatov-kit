import { TInputControl } from '../../base/input-control'
import { TPresentable, type IPresentableOptions } from '../../base/presentable'
import type { ISwitch, ISwitchProps, TSwitchEvents } from './types'
import { TIcon } from '../icon'


export default class TSwitch
	extends TInputControl<boolean | null, ISwitchProps, TSwitchEvents>
	implements ISwitch
{
	static override baseClass = 's-switch'

	static defaultValues: Partial<ISwitchProps> = {
		...TInputControl.defaultValues,
		value: false,
		variant: 'normal',
	}

	protected _icon?: TIcon

	constructor(options: IPresentableOptions<ISwitchProps> | Partial<ISwitchProps> = {}) {
		super(options)

		const { props = {} as Partial<ISwitchProps> } = TPresentable.prepareOptions<ISwitchProps>(
			options as any,
		)

		this.value = props.value ?? (TSwitch.defaultValues.value as boolean | null)
		this.icon = props.icon ?? TSwitch.defaultValues.icon!

		// legacy compat: UI layer historically listens to changeValue
		this.events.on('change:value' as any, (value: boolean | null) => {
			this.events.emit('changeValue' as any, value)
		})

		this.events.on('change:size' as any, (value: any) => {
			if (this._icon) this._icon.size = value
		})
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
		const oldValue = this.value

		this.value = this.value === true ? false : true

		if (oldValue !== this.value) {
			this.events.emit('change' as any, {
				event,
				value: this.value,
			})
		}
	}

	getProps(): ISwitchProps {
		return {
			...super.getProps(),
			icon: this.icon,
		}
	}
}
