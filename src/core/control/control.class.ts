import { TComponent } from '../component'
import type { IControl, TControlEventsMap } from './types'

export default class TControl extends TComponent<TControlEventsMap> implements IControl {
	private _text: string
	private _disabled: boolean
	private _focused: boolean

	constructor(props: Partial<IControl> = {}) {
		super(props)

		this._text = props.text ?? ''
		this._disabled = props.disabled ?? false
		this._focused = props.focused ?? false
	}

	get text(): string {
		return this._text
	}

	set text(value: string) {
		this._text = value
	}

	get disabled(): boolean {
		return this._disabled
	}

	set disabled(value: boolean) {
		this._disabled = value
	}

	get focused(): boolean {
		return this._focused
	}

	set focused(value: boolean) {
		this._focused = value
	}

	afterHide(): void {
		super.afterHide()
		this._focused = false
	}
}
