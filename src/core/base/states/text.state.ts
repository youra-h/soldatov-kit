import { TStateUnit } from '../state-unit'
import type { TEvented } from '../../common/evented'
import type { TStateCtor } from './types'

/**
 * События `TTextState`.
 */
export type TTextStateEvents = {
	/**
	 * Срабатывает, когда `text` изменился через сеттер.
	 */
	change: (value: string) => void
}

/** @deprecated Используй `IStateUnit<string>` (value-based state). */
export interface ITextState {
	text: string
	readonly events: TEvented<TTextStateEvents>
	/** value-based API */
	value: string
}

export type TTextStateCtor = TStateCtor<ITextState, string>

/**
 * Единица состояния для текстового значения (label/content).
 *
 * Используется как внутренний модуль состояния в компонентах: компонент хранит `TTextState`,
 * подписывается на `events.change` и пробрасывает событие наружу (например, `changeText`).
 *
 * Примечание: `text` — это именно отображаемый текст/подпись, а не `value`.
 */
export class TTextState extends TStateUnit<string, TTextStateEvents> implements ITextState {
	/** @deprecated Используй `TStateUnit<string>` (value-based state). */
	constructor(initial: string = '') {
		super(initial)
	}

	get text(): string {
		return this.value
	}

	set text(value: string) {
		this.value = value
	}
}
