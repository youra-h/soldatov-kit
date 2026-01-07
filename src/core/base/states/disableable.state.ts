import { TStateUnit } from '../state-unit'
import type { TEvented } from '../../common/evented'

/**
 * События `TDisableableState`.
 */
export type TDisableableStateEvents = {
	/**
	 * Срабатывает, когда `disabled` изменился.
	 */
	change: (value: boolean) => void
}

export interface IDisableableState {
	disabled: boolean
	readonly events: TEvented<TDisableableStateEvents>
}

export type TDisableableStateCtor<TState extends IDisableableState = IDisableableState> = new (
	initial?: boolean,
) => TState

/**
 * Единица состояния "disabled".
 *
 * Хранит флаг недоступности и эмитит локальное событие `change`.
 * Компонент-агрегат может пробросить это наружу как `disabled`.
 */
export class TDisableableState extends TStateUnit<TDisableableStateEvents> implements IDisableableState {
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
