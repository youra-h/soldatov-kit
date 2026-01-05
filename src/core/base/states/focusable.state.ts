import { TStateUnit } from '../state-unit'

export type TFocusableStateEvents = {
	change: (value: boolean) => void
}

/**
 * Поведение фокуса без собственного event-emitter.
 *
 * Эмитит через `host.events`:
 * - `change:focused`
 * - `focused` (legacy)
 */


export class TFocusableState extends TStateUnit<TFocusableStateEvents> {
	private _focused = false

	constructor(initialFocused: boolean = false) {
		super()
		this._focused = initialFocused
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
