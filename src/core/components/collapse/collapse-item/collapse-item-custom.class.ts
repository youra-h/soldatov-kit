import TValueControl from '../../../base/value-control/value-control.class'
import type { IComponentViewOptions } from '../../../base/component-view'
import { TComponentView } from '../../../base/component-view'
import { resolveState } from '../../../common/resolve-state'
import { TStateUnit, type IStateUnit } from '../../../common/state-unit'
import type { TValuePayload } from '../../../common/types'
import type {
	ICollapseItemCustom,
	ICollapseItemCustomProps,
	TCollapseArrowPlacement,
	TCollapseItemCustomEvents,
	TCollapseItemCustomStatesOptions,
} from './types'
import type { TCollapseAppearance } from '../types'
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
		arrowPlacement: 'start',
	}

	protected _textState: IStateUnit<string>
	protected _arrowPlacement!: TCollapseArrowPlacement
	private _appearanceResolver: (() => TCollapseAppearance) | undefined

	constructor(
		options:
			| IComponentViewOptions<TProps, TCollapseItemCustomStatesOptions>
			| Partial<TProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TCollapseItemCustom

		const { props = {}, states } = TComponentView.prepareOptions<
			TProps,
			TCollapseItemCustomStatesOptions
		>(options)

		const customProps = props as Partial<ICollapseItemCustomProps>

		this._textState = resolveState<IStateUnit<string>, string>({
			state: states?.text,
			ctor: TStateUnit,
			initial: customProps.text ?? ctor.defaultValues.text!,
		})

		this._textState.events.on('change', (payload: TValuePayload<string>) => {
			;(this.events as TEvented<TCollapseItemCustomEvents>).emit('change:text', payload)
		})

		this._arrowPlacement = customProps.arrowPlacement ?? ctor.defaultValues.arrowPlacement!
	}

	get text(): string {
		return this._textState.value
	}

	set text(value: string) {
		this._textState.value = value
	}

	get arrowPlacement(): TCollapseArrowPlacement {
		return this._arrowPlacement
	}

	set arrowPlacement(value: TCollapseArrowPlacement) {
		if (this._arrowPlacement !== value) {
			this._arrowPlacement = value
			;(this.events as TEvented<TCollapseItemCustomEvents>).emit(
				'change:arrowPlacement',
				value,
			)
		}
	}

	/** Инжектируется из TCollapse при добавлении элемента в коллекцию */
	setAppearanceResolver(resolver: () => TCollapseAppearance): void {
		this._appearanceResolver = resolver
	}

	get appearance(): TCollapseAppearance {
		return this._appearanceResolver?.() ?? 'plain'
	}

	override getProps(): TProps {
		return {
			...super.getProps(),
			text: this.text,
			arrowPlacement: this._arrowPlacement,
			appearance: this.appearance,
		} as TProps
	}
}
