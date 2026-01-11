import { TStateUnit, type IStateUnit } from '../state-unit'
import type { TEvented } from '../../common/evented'
import type { TStateCtor } from './types'

/**
 * События `TDisableableState`.
 */
export type TDisableableStateEvents = {
	/**
	 * Срабатывает, когда `disabled` изменился.
	 */
	change: (value: boolean) => void
}

/** @deprecated Используй `IStateUnit<boolean>` (value-based state). */
export interface IDisableableState {
	disabled: boolean
	readonly events: TEvented<TDisableableStateEvents>
	/** value-based API */
	value: boolean
}

export type TDisableableStateCtor = TStateCtor<IDisableableState>

/**
 * Единица состояния "disabled".
 *
 * Хранит флаг недоступности и эмитит локальное событие `change`.
 * Компонент-агрегат может пробросить это наружу как `disabled`.
 */
/** @deprecated Используй `TStateUnit<boolean>` (value-based state). */
export class TDisableableState
	extends TStateUnit<boolean, TDisableableStateEvents>
	implements IDisableableState
{
	constructor(initial: boolean = false) {
		super(initial)
	}

	get disabled(): boolean {
		return this.value
	}

	set disabled(value: boolean) {
		this.value = value
	}
}
