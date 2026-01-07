import { TStateUnit } from '../state-unit'
import type { TEvented } from '../../common/evented'

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
 * Нужен для того, чтобы агрегирующие компоненты (например, presentable)
 * могли принимать альтернативные реализации state (через фабрики/опции),
 * не привязываясь к конкретному классу.
 */
export interface IVisibilityState {
	visible: boolean
	show(): void
	hide(): void
	readonly events: TEvented<TVisibilityStateEvents>
}

export type TVisibilityStateCtor<TState extends IVisibilityState = IVisibilityState> = new (
	initial?: boolean,
) => TState

/**
 * Единица состояния "visible".
 *
 * Хранит флаг видимости и эмитит локальное событие `change`.
 * Компонент-агрегат обычно пробрасывает его наружу как `change:visible`.
 */
export class TVisibilityState extends TStateUnit<TVisibilityStateEvents> implements IVisibilityState {
	private _visible = true

	constructor(initial: boolean = true) {
		super()
		this._visible = initial
	}

	get visible(): boolean {
		return this._visible
	}

	set visible(value: boolean) {
		if (this._visible === value) return
		this._visible = value
		this.events.emit('change', value)
	}

	show(): void {
		this.visible = true
	}

	hide(): void {
		this.visible = false
	}
}
