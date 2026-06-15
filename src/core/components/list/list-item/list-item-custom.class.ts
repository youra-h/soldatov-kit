import TValueControl from '../../../base/value-control/value-control.class'
import type { IComponentViewOptions } from '../../../base/component-view'
import { TComponentView } from '../../../base/component-view'
import { TStateUnit } from '../../../common/state-unit'
import type { TValuePayload } from '../../../common/types'
import type {
	IListItemCustom,
	IListItemCustomProps,
	TListItemCustomEvents,
	TListItemCustomStates,
} from './types'
import { TEvented } from '../../../common/evented'

export default class TListItemCustom<
	TProps extends IListItemCustomProps = IListItemCustomProps,
	TEvents extends TListItemCustomEvents<any> = TListItemCustomEvents,
>
	extends TValueControl<string | number, TProps, TEvents, TListItemCustomStates>
	implements IListItemCustom<TProps>
{
	static override baseClass = 's-list-item'

	static defaultValues: Partial<IListItemCustomProps> = {
		...TValueControl.defaultValues,
		text: '',
		value: undefined,
		variant: 'normal',
		tag: 'div',
	}

	constructor(
		options:
			| IComponentViewOptions<TProps, TListItemCustomStates>
			| Partial<TProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TListItemCustom

		const { props = {}, states } = TComponentView.prepareOptions<
			TProps,
			TListItemCustomStates
		>(options)

		const customProps = props as Partial<IListItemCustomProps>

		this._states.text =
			states?.text ??
			new TStateUnit<string>({ initial: customProps.text ?? ctor.defaultValues.text! })

		this._states.text.events.on('change', (payload: TValuePayload<string>) => {
			;(this.events as TEvented<TListItemCustomEvents>).emit('change:text', payload)
		})
	}

	get text(): string {
		return this._states.text.value
	}

	set text(value: string) {
		this._states.text.value = value
	}

	override getProps(): TProps {
		return {
			...super.getProps(),
			text: this.text,
		} as TProps
	}
}
