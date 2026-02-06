import { TInputControl } from '../../base/input-control'
import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import type { ISwitch, ISwitchProps, TSwitchEvents } from './types'


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

	constructor(options: IComponentViewOptions<ISwitchProps> | Partial<ISwitchProps> = {}) {
		super(options)

		const { props = {} as Partial<ISwitchProps> } = TComponentView.prepareOptions<ISwitchProps>(
			options as any,
		)

		this.value = props.value ?? (TSwitch.defaultValues.value as boolean | null)

		// legacy compat: UI layer historically listens to changeValue
		this.events.on('change:value' as any, (value: boolean | null) => {
			this.events.emit('changeValue' as any, value)
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
		}
	}
}
