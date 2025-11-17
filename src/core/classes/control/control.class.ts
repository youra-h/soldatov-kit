import { TComponent, type IComponentOptions } from './../component'
import { TBaseControl } from '../base-control'
import type { IControl, IControlProps, TControlEvents } from './types'
import type { TComponentSize } from '../../common/types'
import { TSize } from '../../common/size'

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
	protected _text: string
	/** В фокусе ли контрол */
	protected _focused: boolean
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

		this._text = props.text ?? TControl.defaultValues.text!
		this._focused = props.focused ?? TControl.defaultValues.focused!
	}

	get text(): string {
		return this._text
	}

	set text(value: string) {
		if (this._text !== value) {
			this._text = value
			this.events.emit('changeText', value)
		}
	}

	get focused(): boolean {
		return this._focused
	}

	set focused(value: boolean) {
		if (this._focused !== value) {
			this._focused = value
			this.events.emit('focused', value)
		}
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
			text: this._text,
			disabled: this._disabled,
			focused: this._focused,
			size: this._sizeHelper.value,
		}
	}

	afterHide(): void {
		super.afterHide()
		this._focused = false
	}
}
