import { TTextable } from '../../base/textable'
import type {
	IButton,
	IButtonProps,
	TButtonView,
	TButtonEvents,
	TButtonStates,
} from './types'
import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import { TEvented } from '../../../common/event/evented'

export default class TButton extends TTextable<IButtonProps, TButtonEvents> implements IButton {
	static override baseClass = 's-button'

	static defaultValues: Partial<IButtonProps> = {
		...TTextable.defaultValues,
		variant: 'normal',
		view: 'filled',
		tag: 'button',
	}

	protected _view!: TButtonView

	constructor(
		options:
			| IComponentViewOptions<IButtonProps, TButtonStates>
			| Partial<IButtonProps> = {},
	) {
		super(options)

		const ctor = new.target as typeof TButton
		const { props = {} } = TComponentView.prepareOptions<
			IButtonProps,
			TButtonStates
		>(options)

		this._applyView(props.view ?? ctor.defaultValues.view!)
	}

	get view(): TButtonView {
		return this._view
	}

	protected _applyView(newValue: TButtonView, oldValue?: TButtonView) {
		this._classes.swap({
			prefix: '--a-',
			oldValue,
			newValue,
		})

		this._view = newValue
	}

	set view(value: TButtonView) {
		if (value && this._view !== value) {
			this._applyView(value, this._view)
			;(this.events as TEvented<TButtonEvents>).emit('change:view', value)
		}
	}

	getProps(): IButtonProps {
		return {
			...super.getProps(),
			view: this._view,
		}
	}
}
