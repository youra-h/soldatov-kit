import { provide, inject, type InjectionKey } from 'vue'

export const DRAG_CONTEXT_KEY: InjectionKey<boolean> = Symbol('drag-context')

export function useProvideDragContext(): void {
	provide(DRAG_CONTEXT_KEY, true)
}

export function useInjectDragContext(): boolean {
	return inject(DRAG_CONTEXT_KEY, false)
}
