import type { TEvented } from '../../common/evented'

type TTextHost = { events: TEvented<any> }

/**
 * Поведение "text" без собственного event-emitter.
 *
 * Важно: в вебе `text` обычно означает подпись/контент (label), а не `value`.
 *
 * Эмитит через `host.events`:
 * - `change:text`
 * - `changeText` (legacy)
 */
export class TTextBehavior {
	private _host: TTextHost
	private _text = ''

	constructor(host: TTextHost, initialText: string = '') {
		this._host = host
		this._text = initialText
	}

	get text(): string {
		return this._text
	}

	set text(value: string) {
		if (this._text === value) return

		this._text = value
		;(this._host.events as any).emit('change:text', value)
		;(this._host.events as any).emit('changeText', value)
	}
}
