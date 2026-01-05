import { TEntity } from '../entity'
import { TEvented } from '../../common/evented'

export type TTextBehaviorEvents = {
	change: (value: string) => void
}

export interface ITextBehaviorProps {
	text: string
}

/**
 * Поведение текстового значения (label/content).
 *
 * Для веба `text` обычно означает *текстовую подпись*, а не `value`.
 */
export class TTextBehavior extends TEntity<ITextBehaviorProps> {
	public readonly events = new TEvented<TTextBehaviorEvents>()
	private _text = ''

	get text(): string {
		return this._text
	}

	set text(value: string) {
		if (this._text !== value) {
			this._text = value
			this.events.emit('change', value)
		}
	}

	getProps(): ITextBehaviorProps {
		return {
			text: this._text,
		}
	}
}
