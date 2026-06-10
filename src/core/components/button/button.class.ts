import { TTextable } from '../../base/textable'
import type {
	IButton,
	IButtonProps,
	TButtonAppearance,
	TButtonEvents,
	TButtonStates,
} from './types'
import { TComponentView, type IComponentViewOptions } from '../../base/component-view'
import { TEvented } from '../../common/evented'

export default class TButton extends TTextable<IButtonProps, TButtonEvents> implements IButton {
	static override baseClass = 's-button'

	static defaultValues: Partial<IButtonProps> = {
		...TTextable.defaultValues,
		variant: 'normal',
		appearance: 'filled',
		tag: 'button',
	}

	protected _appearance!: TButtonAppearance

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

		this._applyAppearance(props.appearance ?? ctor.defaultValues.appearance!)
	}

	get appearance(): TButtonAppearance {
		return this._appearance
	}

	protected _applyAppearance(newValue: TButtonAppearance, oldValue?: TButtonAppearance) {
		this._classes.swap({
			prefix: '--a-',
			oldValue,
			newValue,
		})

		this._appearance = newValue
	}

	set appearance(value: TButtonAppearance) {
		if (value && this._appearance !== value) {
			this._applyAppearance(value, this._appearance)
			;(this.events as TEvented<TButtonEvents>).emit('change:appearance', value)
		}
	}

	getProps(): IButtonProps {
		return {
			...super.getProps(),
			appearance: this._appearance,
		}
	}
}
