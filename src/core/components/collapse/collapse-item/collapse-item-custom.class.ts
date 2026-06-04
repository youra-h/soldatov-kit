import TValueControl from '../../../base/value-control/value-control.class'
import type { IComponentViewOptions } from '../../../base/component-view'
import { TComponentView } from '../../../base/component-view'
import { resolveState } from '../../../common/resolve-state'
import { TStateUnit, type IStateUnit } from '../../../common/state-unit'
import type { TValuePayload } from '../../../common/types'
import type {
	ICollapseItemCustom,
	ICollapseItemCustomProps,
	TCollapseItemCustomEvents,
	TCollapseItemCustomStatesOptions,
} from './types'
import { TEvented } from '../../../common/evented'

export default class TCollapseItemCustom<
	TProps extends ICollapseItemCustomProps = ICollapseItemCustomProps,
	TEvents extends TCollapseItemCustomEvents<any> = TCollapseItemCustomEvents,
>
	extends TValueControl<string | number, TProps, TEvents, TCollapseItemCustomStatesOptions>
	implements ICollapseItemCustom<TProps>
{
	static override baseClass = 's-collapse-item'

	static defaultValues: Partial<ICollapseItemCustomProps> = {
		...TValueControl.defaultValues,
		text: '',
		value: '',
		variant: 'normal',
		tag: 'button',
	}

	protected _textState: IStateUnit<string>

	constructor(
		options:
			| IComponentViewOptions<TProps, TCollapseItemCustomStatesOptions>
			| Partial<TProps> = {},
	) {
		super(options)

		const { props = {}, states } = TComponentView.prepareOptions<
			TProps,
			TCollapseItemCustomStatesOptions
		>(options)

		const customProps = props as Partial<ICollapseItemCustomProps>

		this._textState = resolveState<IStateUnit<string>, string>({
			state: states?.text,
			ctor: TStateUnit,
			initial: customProps.text ?? TCollapseItemCustom.defaultValues.text!,
		})

		this._textState.events.on('change', (payload: TValuePayload<string>) => {
			;(this.events as TEvented<TCollapseItemCustomEvents>).emit('change:text', payload)
		})
	}

	get text(): string {
		return this._textState.value
	}

	set text(value: string) {
		this._textState.value = value
	}

	override getProps(): TProps {
		return {
			...super.getProps(),
			text: this.text,
		} as TProps
	}
}
