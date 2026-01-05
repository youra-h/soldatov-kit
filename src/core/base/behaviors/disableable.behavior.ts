import { TStateUnit } from '../state-unit'

export type TDisableableBehaviorEvents = {
	change: (value: boolean) => void
}

/**
 * Поведение "disabled" без собственного event-emitter.
 *
 * Эмитит изменения через `host.events`:
 * - `change:disabled` (новый контракт)
 * - `disabled` (legacy, чтобы не ломать существующие обвязки)
 */

export class TDisableableBehavior extends TStateUnit<TDisableableBehaviorEvents> {
	private _disabled = false

	constructor(initialDisabled: boolean = false) {
		super()
		this._disabled = initialDisabled
	}

	get disabled(): boolean {
		return this._disabled
	}

	set disabled(value: boolean) {
		if (this._disabled === value) return

		this._disabled = value

		this.events.emit('change', value)
	}
}
