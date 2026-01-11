import { TStateUnit } from '../state-unit'
import type { TEvented } from '../../common/evented'
import type { TStateCtor } from './types'

/**
 * События `TFocusableState`.
 */
export type TFocusableStateEvents = {
	/**
	 * Срабатывает, когда `focused` изменился.
	 */
	change: (value: boolean) => void
}

/** @deprecated Используй `IStateUnit<boolean>` (value-based state). */
export interface IFocusableState {
	focused: boolean
	readonly events: TEvented<TFocusableStateEvents>
	/** value-based API */
	value: boolean
}

export type TFocusableStateCtor = TStateCtor<IFocusableState>

/**
 * Единица состояния "focused".
 *
 * Это headless-состояние фокуса (не DOM-фокус), полезно для:
 * - тестов
 * - навигации/управления фокусом на уровне модели
 * - синхронизации с UI-обвязкой (Vue/React и т.п.)
 */
export class TFocusableState
	extends TStateUnit<boolean, TFocusableStateEvents>
	implements IFocusableState
{
	/** @deprecated Используй `TStateUnit<boolean>` (value-based state). */
	constructor(initial: boolean = false) {
		super(initial)
	}

	get focused(): boolean {
		return this.value
	}

	set focused(value: boolean) {
		this.value = value
	}
}
