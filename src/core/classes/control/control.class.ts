import { TComponent, type IComponentOptions } from '../../base/component'
import { TBaseControl } from '../base-control'
import type { IControl, IControlProps, TControlEvents } from './types'
import type { TComponentSize } from '../../common/types'
import { TSize } from '../../common/size'
import { TFocusableBehavior } from '../behavior/focusable.behavior'
import { TTextBehavior } from '../behavior/text.behavior'

export default class TControl<
		TProps extends IControlProps = IControlProps,
		TEvents extends TControlEvents = TControlEvents,
	>
	extends TBaseControl<TProps, TEvents>
	implements IControl
{
	static defaultValues: Partial<IControlProps> = {
		...TBaseControl.defaultValues,
		text: '',
		focused: false,
		size: 'normal',
	}

	/** Текстовое представление контрола */
	protected _textBehavior: TTextBehavior
	protected _focusBehavior: TFocusableBehavior
	/** Размер контрола */
	protected _sizeHelper: TSize

	constructor(options: IComponentOptions<IControlProps> = {}) {
		options = TComponent.prepareOptions(options, 's-control')

		super(options)

		const { props = {} } = options

		this._sizeHelper = new TSize({
			baseClass: this._baseClass,
			value: props.size ?? TControl.defaultValues.size!,
		})

		this._textBehavior = new TTextBehavior(
			this,
			props.text ?? TControl.defaultValues.text!,
		)

		this._focusBehavior = new TFocusableBehavior(
			this,
			props.focused ?? TControl.defaultValues.focused!,
		)
	}

	get text(): string {
		return this._textBehavior.text
	}

	set text(value: string) {
		this._textBehavior.text = value
	}

	get focused(): boolean {
		return this._focusBehavior.focused
	}

	set focused(value: boolean) {
		this._focusBehavior.focused = value
	}

	get size(): TComponentSize {
		return this._sizeHelper.value
	}

	set size(value: TComponentSize) {
		if (this._sizeHelper.value !== value) {
			this._sizeHelper.value = value
		}
	}

	get classes(): string[] {
		const classes = []

		// Добавляем класс для размера
		classes.push(...this._sizeHelper.getClass())

		return classes
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			name: this._name,
			text: this._textBehavior.text,
			disabled: this.disabled,
			focused: this._focusBehavior.focused,
			size: this._sizeHelper.value,
		}
	}

	afterHide(): void {
		super.afterHide()
		this._focusBehavior.focused = false
	}
}
