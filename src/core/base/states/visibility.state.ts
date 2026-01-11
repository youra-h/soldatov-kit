import { TStateUnit, type IStateUnit, type TStateUnitValueEvents } from '../state-unit'
import type { TStateCtor } from './types'

export interface IVisibilityState extends IStateUnit<boolean> {
	show(): void
	hide(): void
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
export class TVisibilityState
	extends TStateUnit<boolean, TStateUnitValueEvents<boolean>>
	implements IVisibilityState
{
	constructor(initial: boolean = true) {
		super(initial)
	}

	show(): void {
		this.value = true
	}

	hide(): void {
		this.value = false
	}
}
