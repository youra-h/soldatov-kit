import { TStateUnit } from '../state-unit'

export type TTextBehaviorEvents = {
	change: (value: string) => void
}

/**
 * Поведение "text" без собственного event-emitter.
 *
 * Важно: в вебе `text` обычно означает подпись/контент (label), а не `value`.
 *
 * Эмитит через `host.events`:
 * - `change:text`
 * - `changeText` (legacy)
 */

export class TTextBehavior extends TStateUnit<TTextBehaviorEvents> {
	private _text = ''

	constructor(initialText: string = '') {
		super()
		this._text = initialText
	}

	get text(): string {
		return this._text
	}

	set text(value: string) {
		if (this._text === value) return

		this._text = value
		this.events.emit('change', value)
	}
}
