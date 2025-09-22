import { TComponent, defaultComponentValues } from './../component'
import type { IControl, TControlEventsMap } from './types'
import type { TObjectProps } from '../object'
import type { TControlSize } from '../../common/types'
import { TSize } from '../../common/size'

export const defaultValues: Partial<IControl> = {
	...defaultComponentValues,
	text: '',
	disabled: false,
	focused: false,
	size: 'normal',
}

export default class TControl<TEvents extends TControlEventsMap>
	extends TComponent<TEvents>
	implements IControl
{
	private _text: string
	private _disabled: boolean
	private _focused: boolean
	private _sizeHelper: TSize

	constructor(props: Partial<IControl> = {}, baseClass: string = 's-control') {
		super(props, baseClass)

		this._sizeHelper = new TSize({
			baseClass: this._baseClass,
			defaultValue: defaultValues.size!,
		})

		this._text = props.text ?? defaultValues.text!
		this._disabled = props.disabled ?? defaultValues.disabled!
		this._focused = props.focused ?? defaultValues.focused!

		this.size = props.size ?? defaultValues.size!
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
			this.emit('enabled', !value)
		}
	}

	get focused(): boolean {
		return this._focused
	}

	set focused(value: boolean) {
		if (this._focused !== value) {
			this._focused = value
			this.emit('focus', value)
		}
	}

	get size(): TControlSize {
		return this._sizeHelper.value
	}

	set size(value: TControlSize) {
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
