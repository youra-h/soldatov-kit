import { provide, inject, type InjectionKey } from 'vue'

export const DRAG_CONTEXT_KEY: InjectionKey<boolean> = Symbol('drag-context')

/**
 * Устанавливает контекст для компонентов, участвующих в drag-and-drop.
 * Компоненты, находящиеся внутри этого контекста, будут автоматически активировать
 * плагин {@link TDragPlugin} для синхронизации порядка элементов при перетаскивании.
 */
export function useProvideDragContext(): void {
	provide(DRAG_CONTEXT_KEY, true)
}

/**
 * Проверяет, находится ли компонент внутри контекста drag-and-drop.
 * Компоненты внутри этого контекста должны активировать плагин {@link TDragPlugin}
 * для синхронизации порядка элементов при перетаскивании.
 * @returns `true`, если компонент находится внутри контекста drag-and-drop, иначе `false`.
 */
export function useInjectDragContext(): boolean {
	return inject(DRAG_CONTEXT_KEY, false)
}
