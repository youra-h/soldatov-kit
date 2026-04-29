import type { TEvented } from '../../core/common/evented'

/**
 * События координатора. Позволяют внешним участникам (composables, другие sync-классы)
 * реагировать на появление и исчезновение DOM-элемента.
 */
export type TUiSyncEvents = {
	/** DOM-элемент появился и первый rAF прошёл */
	mount: (el: Element) => void
	/** DOM-элемент удалён */
	unmount: () => void
}

/**
 * Обработчик одного аспекта DOM-синхронизации.
 * Каждый конкретный класс обрабатывает ровно одно поведение (индикатор, скролл, позиционирование и т.д.).
 */
export interface IUiSyncHandler {
	/** Вызывается координатором после mount, когда el уже доступен в DOM */
	mount(el: Element): void
	/** Вызывается координатором при unmount */
	unmount(): void
	/** Освободить ресурсы: отписки от событий, observers */
	free(): void
}

/**
 * Координатор DOM-синхронизации компонента.
 * Владеет списком обработчиков и управляет их жизненным циклом через el.
 * Создаётся в setup() Vue-компонента, el передаётся через useElementSync().
 */
export interface IUiSync {
	/** События координатора — для подключения внешних наблюдателей */
	readonly events: TEvented<TUiSyncEvents>
	/** Текущий DOM-элемент (null если не смонтирован) */
	get el(): Element | null
	/** Устанавливает DOM-элемент. mount вызывается после rAF, unmount — немедленно */
	set el(value: Element | null)
	/** Освободить все обработчики */
	free(): void
}
