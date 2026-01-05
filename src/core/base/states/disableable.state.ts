import { TStateUnit } from '../state-unit'

/**
 * События `TDisableableState`.
 */
export type TDisableableStateEvents = {
	/**
	 * Срабатывает, когда `disabled` изменился.
	 */
	change: (value: boolean) => void
}

/**
 * Единица состояния "disabled".
 *
 * Хранит флаг недоступности и эмитит локальное событие `change`.
 * Компонент-агрегат может пробросить это наружу как `disabled`.
 */
export class TDisableableState extends TStateUnit<TDisableableStateEvents> {
	private _disabled = false

	constructor(initial: boolean = false) {
		super()
		this._disabled = initial
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
