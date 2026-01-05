import { TStateUnit } from '../state-unit'

export type TFocusableStateEvents = {
	change: (value: boolean) => void
}

export class TFocusableState extends TStateUnit<TFocusableStateEvents> {
	private _focused = false

	constructor(initial: boolean = false) {
		super()
		this._focused = initial
	}

	get focused(): boolean {
		return this._focused
	}

	set focused(value: boolean) {
		if (this._focused === value) return

		this._focused = value

		this.events.emit('change', value)
	}
}
