import { TStateUnit } from '../state-unit'

/**
 * События `TTextState`.
 */
export type TTextStateEvents = {
	/**
	 * Срабатывает, когда `text` изменился через сеттер.
	 */
	change: (value: string) => void
}

/**
 * Единица состояния для текстового значения (label/content).
 *
 * Используется как внутренний модуль состояния в компонентах: компонент хранит `TTextState`,
 * подписывается на `events.change` и пробрасывает событие наружу (например, `changeText`).
 *
 * Примечание: `text` — это именно отображаемый текст/подпись, а не `value`.
 */
export class TTextState extends TStateUnit<TTextStateEvents> {
	private _text = ''

	constructor(initial: string = '') {
		super()
		this._text = initial
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
