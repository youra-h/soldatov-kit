import { ref, onUnmounted, type Ref, watch } from 'vue'
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
	const elementPlugin = bundle.get(TElementPlugin)!

	function syncElement(el: Element | ComponentPublicInstance | null) {
		elementPlugin.element = (el as ComponentPublicInstance)?.$el ?? (el as Element) ?? null
	}

	watch(rootRef, syncElement, { flush: 'post' })

	onUnmounted(() => {
		elementPlugin.element = null
	})

	return rootRef
}
