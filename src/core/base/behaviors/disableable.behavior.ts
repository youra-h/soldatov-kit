import type { TEvented } from '../../common/evented'

type TDisableableHost = { events: TEvented<any> }

/**
 * Поведение "disabled" без собственного event-emitter.
 *
 * Эмитит изменения через `host.events`:
 * - `change:disabled` (новый контракт)
 * - `disabled` (legacy, чтобы не ломать существующие обвязки)
 */
export class TDisableableBehavior {
	private _host: TDisableableHost
	private _disabled = false

	constructor(host: TDisableableHost, initialDisabled: boolean = false) {
		this._host = host
		this._disabled = initialDisabled
	}

	get disabled(): boolean {
		return this._disabled
	}

	set disabled(value: boolean) {
		if (this._disabled === value) return

		this._disabled = value
		;(this._host.events as any).emit('change:disabled', value)
		;(this._host.events as any).emit('disabled', value)
	}
}
