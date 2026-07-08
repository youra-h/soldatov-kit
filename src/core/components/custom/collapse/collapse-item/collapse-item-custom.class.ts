import { TValueControl } from '../../../base/value-control'
import type { IComponentViewOptions } from '../../../base/component-view'
import { TComponentView } from '../../../base/component-view'
import { TStateUnit, TEvented } from '../../../../common'
import type { TValuePayload } from '../../../../bridge'
import type {
	ICollapseItemCustom,
	ICollapseItemCustomProps,
	TCollapseArrowPlacement,
	TCollapseItemCustomEvents,
	TCollapseItemCustomStates,
} from './types'
import type { TCollapseView } from '../types'

export default class TCollapseItemCustom<
	TProps extends ICollapseItemCustomProps = ICollapseItemCustomProps,
	TEvents extends TCollapseItemCustomEvents<any> = TCollapseItemCustomEvents,
>
	extends TValueControl<string | number, TProps, TEvents, TCollapseItemCustomStates>
	implements ICollapseItemCustom<TProps> {
	static override baseClass = 's-collapse-item'

	static defaultValues: Partial<ICollapseItemCustomProps> = {
		...TValueControl.defaultValues,
		text: '',
		value: '',
		variant: 'normal',
		tag: 'button',
		arrowPlacement: 'start',
	}

	protected _arrowPlacement!: TCollapseArrowPlacement
	private _viewResolver: (() => TCollapseView) | undefined

	constructor(
		options:
			| IComponentViewOptions<TProps, TCollapseItemCustomStates>
			| Partial<TProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TCollapseItemCustom

		const { props = {}, states } = TComponentView.prepareOptions<
			TProps,
			TCollapseItemCustomStates
		>(options)

		const customProps = props as Partial<ICollapseItemCustomProps>

		this._states.text =
			states?.text ??
			new TStateUnit<string>({ initial: customProps.text ?? ctor.defaultValues.text! })

		this._states.text.events.on('change', (payload: TValuePayload<string>) => {
			; (this.events as TEvented<TCollapseItemCustomEvents>).emit('change:text', payload)
		})

		this._arrowPlacement = customProps.arrowPlacement ?? ctor.defaultValues.arrowPlacement!
	}

	get text(): string {
		return this._states.text.value
	}

	set text(value: string) {
		this._states.text.value = value
	}

	get arrowPlacement(): TCollapseArrowPlacement {
		return this._arrowPlacement
	}

	set arrowPlacement(value: TCollapseArrowPlacement) {
		if (this._arrowPlacement !== value) {
			this._arrowPlacement = value
				; (this.events as TEvented<TCollapseItemCustomEvents>).emit(
					'change:arrowPlacement',
					value,
				)
		}
	}

	/** Инжектируется из TCollapse при добавлении элемента в коллекцию */
	setViewResolver(resolver: () => TCollapseView): void {
		this._viewResolver = resolver
	}

	get view(): TCollapseView {
		return this._viewResolver?.() ?? 'plain'
	}

	override getProps(): TProps {
		return {
			...super.getProps(),
			text: this.text,
			arrowPlacement: this._arrowPlacement,
			view: this.view,
		} as TProps
	}
}
