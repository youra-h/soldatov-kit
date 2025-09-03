import { TComponent, defaultComponentValues } from '../component'
import type { IControl, TControlEventsMap } from './types'
import type { TObjectProps } from '../object'

export const defaultValues: Partial<IControl> = {
	...defaultComponentValues,
	text: '',
	disabled: false,
	focused: false,
}

export default class TControl<TEvents extends TControlEventsMap>
	extends TComponent<TEvents>
	implements IControl
{
	private _text: string
	private _disabled: boolean
	private _focused: boolean

	constructor(props: Partial<IControl> = {}) {
		super(props)

		this._text = props.text ?? defaultValues.text!
		this._disabled = props.disabled ?? defaultValues.disabled!
		this._focused = props.focused ?? defaultValues.focused!
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

	getProps(): TObjectProps {
		return {
			...super.getProps(),
			text: this._text,
			disabled: this._disabled,
			focused: this._focused,
		}
	}

	afterHide(): void {
		super.afterHide()
		this._focused = false
	}
}
