import { TStateUnit } from '../state-unit'

/**
 * События `TFocusableState`.
 */
export type TFocusableStateEvents = {
	/**
	 * Срабатывает, когда `focused` изменился.
	 */
	change: (value: boolean) => void
}

/**
 * Единица состояния "focused".
 *
 * Это headless-состояние фокуса (не DOM-фокус), полезно для:
 * - тестов
 * - навигации/управления фокусом на уровне модели
 * - синхронизации с UI-обвязкой (Vue/React и т.п.)
 */
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
