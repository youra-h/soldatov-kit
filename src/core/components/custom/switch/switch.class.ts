import { TInputControl } from '../../base/input-control'
import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import type { ISwitch, ISwitchProps, TSwitchEvents } from './types'

export default class TSwitch
	extends TInputControl<boolean | undefined, ISwitchProps, TSwitchEvents>
	implements ISwitch {
	static override baseClass = 's-switch'

	static defaultValues: Partial<ISwitchProps> = {
		...TInputControl.defaultValues,
		value: false,
		variant: 'normal',
	}

	constructor(options: IComponentViewOptions<ISwitchProps> | Partial<ISwitchProps> = {}) {
		super(options)

		const ctor = new.target as typeof TSwitch

		const { props = {} as Partial<ISwitchProps> } =
			TComponentView.prepareOptions<ISwitchProps>(options)

		this.value = props.value ?? (ctor.defaultValues.value as boolean)
	}

	/**
	 * Переключает состояние компонента
	 * Если было true, то станет false
	 */
	toggle(): void {
		this.value = this.value === true ? false : true
	}

	getProps(): ISwitchProps {
		return {
			...super.getProps(),
		}
	}
}
