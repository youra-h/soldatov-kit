import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { IPluginBundle } from '@plugins/base'
import { TElementPlugin } from '@plugins/common/element'

/**
 * Утилита для привязки DOM-элемента к `TElementPlugin` внутри бандла.
 * Позволяет легко синхронизировать элемент, на который указывает `rootRef`, с `TElementPlugin` в бандле.
 * @param bundle - бандл, содержащий `TElementPlugin`, который будет синхронизирован с DOM-элементом, на который указывает `rootRef`.
 * @returns `Ref`, который должен быть привязан к корневому элементу компонента. Этот элемент будет автоматически синхронизирован с `TElementPlugin` в бандле при монтировании и размонтировании компонента.
 */
export function useElementBinding(
	bundle: IPluginBundle,
): Ref<Element | ComponentPublicInstance | null> {
	const rootRef = ref<Element | ComponentPublicInstance | null>(null)

	onMounted(() => {
		const el = rootRef.value
		bundle.get(TElementPlugin)!.element =
			(el as ComponentPublicInstance)?.$el ?? (el as Element) ?? null
	})

	onUnmounted(() => {
		bundle.get(TElementPlugin)!.element = null
	})

	return rootRef
}
