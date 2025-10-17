import { TComponent, defaultValuesComponent, type IComponentOptions } from './../component'
import type { IControl, TControlEvents } from './types'
import type { TObjectProps } from '../object'
import type { TComponentSize } from '../../common/types'
import { TSize } from '../../common/size'

export const defaultValues: Partial<IControl> = {
	...defaultValuesComponent,
	text: '',
	disabled: false,
	focused: false,
	size: 'normal',
}

export default class TControl<TEvents extends TControlEvents> extends TComponent<TEvents> implements IControl {
	/** Имя контрола */
	protected _name: string
	/** Текстовое представление контрола */
	protected _text: string
	/** Заблокирован ли контрол */
	protected _disabled: boolean
	/** В фокусе ли контрол */
	protected _focused: boolean
	/** Размер контрола */
	protected _sizeHelper: TSize

	constructor(options: IComponentOptions<IControl> = {}) {
		options = TComponent.prepareOptions(options, 's-control')

		super(options)

		const { props = {} } = options

		this._sizeHelper = new TSize({
			baseClass: this._baseClass,
			value: props.size ?? defaultValues.size!,
		})

		this._name = props.name ?? ''
		this._text = props.text ?? defaultValues.text!
		this._disabled = props.disabled ?? defaultValues.disabled!
		this._focused = props.focused ?? defaultValues.focused!
	}

	get name(): string {
		return this._name && this._name !== '' ? this._name : this._id.toString()
	}

	set name(value: string) {
		if (this._name !== value) {
			this._name = value
		}
	}

	get text(): string {
		return this._text
	}

	set text(value: string) {
		if (this._text !== value) {
			this._text = value
			this.emit('changeText', value)
		}
	}

	get disabled(): boolean {
		return this._disabled
	}

	set disabled(value: boolean) {
		if (this._disabled !== value) {
			this._disabled = value
			this.emit('disabled', value)
		}
	}

	get focused(): boolean {
		return this._focused
	}

	set focused(value: boolean) {
		if (this._focused !== value) {
			this._focused = value
			this.emit('focused', value)
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

	getProps(): TObjectProps {
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
