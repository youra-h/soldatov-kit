import type { IUiSyncHandler } from './types'

/**
 * Базовый класс обработчика DOM-синхронизации.
 *
 * Управляет жизненным циклом _el: устанавливает его в mount(), обнуляет в unmount().
 * Наследники переопределяют хуки onMount() / onUnmount() вместо самих методов,
 * чтобы не писать бойлерплейт с _el в каждом классе.
 */
export abstract class TUiSyncHandler implements IUiSyncHandler {
	protected _el: Element | null = null

	mount(el: Element): void {
		this._el = el
		this.onMount(el)
	}

	unmount(): void {
		this.onUnmount()
		this._el = null
	}

	/** Переопределить для логики при появлении el */
	protected onMount(_el: Element): void {}

	/** Переопределить для логики при исчезновении el */
	protected onUnmount(): void {}

	abstract free(): void
}
