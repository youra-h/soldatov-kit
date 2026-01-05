import { TStateUnit } from '../state-unit'

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
 * Единица состояния "visible".
 *
 * Хранит флаг видимости и эмитит локальное событие `change`.
 * Компонент-агрегат обычно пробрасывает его наружу как `change:visible`.
 */
export class TVisibilityState extends TStateUnit<TVisibilityStateEvents> {
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
