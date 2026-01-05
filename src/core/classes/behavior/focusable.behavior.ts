import type { TEvented } from '../../common/evented'

type TFocusableHost = { events: TEvented<any> }

/**
 * Поведение фокуса без собственного event-emitter.
 *
 * Эмитит через `host.events`:
 * - `change:focused`
 * - `focused` (legacy)
 */
export class TFocusableBehavior {
	private _host: TFocusableHost
	private _focused = false

	constructor(host: TFocusableHost, initialFocused: boolean = false) {
		this._host = host
		this._focused = initialFocused
	}

	get focused(): boolean {
		return this._focused
	}

	set focused(value: boolean) {
		if (this._focused === value) return

		this._focused = value
		;(this._host.events as any).emit('change:focused', value)
		;(this._host.events as any).emit('focused', value)
	}
}
