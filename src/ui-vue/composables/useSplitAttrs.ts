import { useAttrs, computed } from 'vue'

/**
 * Разделяет fallthrough-атрибуты на две группы:
 * - `containerAttrs` — class, style (на корневой контейнер)
 * - `controlAttrs`  — всё остальное: события, aria-*, data-* (на интерактивный контрол)
 */
export function useSplitAttrs() {
	const attrs = useAttrs()

	const containerAttrs = computed(() => {
		const result: Record<string, unknown> = {}
		if (attrs.class) result.class = attrs.class
		if (attrs.style) result.style = attrs.style
		return result
	})

	const controlAttrs = computed(() => {
		const { class: _, style: __, ...rest } = attrs
		return rest
	})

	return { containerAttrs, controlAttrs }
}
