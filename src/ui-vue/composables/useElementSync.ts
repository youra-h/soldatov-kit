import { ref, onMounted, onUnmounted } from 'vue'
import type { ComponentPublicInstance } from 'vue'

/**
 * Синхронизирует root DOM-элемент Vue-компонента с `instance.el`.
 *
 * Использование:
 * ```ts
 * const rootRef = useElementSync(instance)
 * ```
 * ```html
 * <div ref="rootRef"> или <MyComponent ref="rootRef">
 * ```
 *
 * Если ref указывает на Vue-компонент — берётся `$el`.
 * Если ref указывает на нативный элемент — используется напрямую.
 */
export function useElementSync(instance: { el: Element | null }) {
	const elRef = ref<ComponentPublicInstance | Element | null>(null)

	onMounted(() => {
		const raw = elRef.value
		instance.el = (raw as ComponentPublicInstance)?.$el ?? (raw as Element) ?? null
	})

	onUnmounted(() => {
		instance.el = null
	})

	return elRef
}
