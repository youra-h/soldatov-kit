import { TInputControl } from '../../base/input-control'
import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import type { ISwitch, ISwitchProps, TSwitchEvents } from './types'

export default class TSwitch
	extends TInputControl<boolean | undefined, ISwitchProps, TSwitchEvents>
	implements ISwitch
{
	static override baseClass = 's-switch'

	static defaultValues: Partial<ISwitchProps> = {
		...TInputControl.defaultValues,
		value: false,
		variant: 'normal',
	}

	constructor(options: IComponentViewOptions<ISwitchProps> | Partial<ISwitchProps> = {}) {
		super(options)

		const { props = {} as Partial<ISwitchProps> } =
			TComponentView.prepareOptions<ISwitchProps>(options)

		this.value = props.value ?? (TSwitch.defaultValues.value as boolean)

		// legacy compat: UI layer historically listens to changeValue
		this.events.on('change:value', (value: boolean | undefined) => {
			this.events.emit('changeValue', value)
		})
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
		if (this.readonly) {
			event?.preventDefault()
			return
		}

		const oldValue = this.value

		this.value = this.value === true ? false : true

		if (oldValue !== this.value) {
			this.events.emit('change', {
				event,
				value: this.value,
			})
		}
	}

	getProps(): ISwitchProps {
		return {
			...super.getProps(),
		}
	}
}
