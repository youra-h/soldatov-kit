import type { TEvented } from '../../core/common/evented'

/**
 * События базового поведения.
 */
export type TUiBehaviorEvents = {
	/** Элемент присоединён к DOM */
	mount: (payload: { el: Element }) => void
	/** Элемент удалён из DOM */
	unmount: () => void
	/** После первой отрисовки браузером (requestAnimationFrame после mount) */
	ready: () => void
}

/**
 * Контракт базового ui-поведения.
 * Каждое поведение привязывается к DOM-элементу и реагирует на события core-инстанса.
 */
export interface IUiBehavior {
	readonly events: TEvented<TUiBehaviorEvents>
	/** Привязать поведение к DOM-элементу */
	set el(value: Element | null)
	get el(): Element | null
	/** Освободить ресурсы (отписки, observers) */
	free(): void
}
