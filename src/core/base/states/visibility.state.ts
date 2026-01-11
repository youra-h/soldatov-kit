import { TStateUnit, type IStateUnit } from '../state-unit'
import type { TEvented } from '../../common/evented'
import type { TStateCtor } from './types'

/**
 * События `TVisibilityState`.
 */
export type TVisibilityStateEvents = {
	/**
	 * Срабатывает, когда `visible` изменился.
	 */
	change: (value: boolean) => void
}

/**
 * Контракт visibility-state.
 * Нужен для того, чтобы агрегирующие компоненты (например, component-view)
 * могли принимать альтернативные реализации state (через фабрики/опции),
 * не привязываясь к конкретному классу.
 */
export interface IVisibilityState {
	/** value-based API */
	value: boolean
	visible: boolean
	show(): void
	hide(): void
	readonly events: TEvented<TVisibilityStateEvents>
}

/**
 * Тип конструктора visibility-state.
 * Является конкретной реализацией универсального TStateCtor.
 */
export type TVisibilityStateCtor = TStateCtor<IVisibilityState>

/**
 * Единица состояния "visible".
 *
 * Хранит флаг видимости и эмитит локальное событие `change`.
 * Компонент-агрегат обычно пробрасывает его наружу как `change:visible`.
 */
export class TVisibilityState extends TStateUnit<boolean, TVisibilityStateEvents> implements IVisibilityState {
	constructor(initial: boolean = true) {
		super(initial)
	}

	get visible(): boolean {
		return this.value
	}

	set visible(value: boolean) {
		this.value = value
	}

	show(): void {
		this.visible = true
	}

	hide(): void {
		this.visible = false
	}
}
