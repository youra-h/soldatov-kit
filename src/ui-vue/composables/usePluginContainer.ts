import { ref, onMounted, onUnmounted } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { IComponentView } from '@core'
import { TComponentViewContainer, TElementPlugin, TInstancePlugin } from '../../plugins'

/**
 * Связывает Vue-компонент с контейнером плагинов: передаёт core-инстанс и синхронизирует
 * root DOM-элемент через `TElementPlugin` и `TInstancePlugin`.
 *
 * Использование:
 * ```ts
 * const plugins = new TComponentViewContainer()
 * const rootRef = usePluginContainer(plugins, instance)
 * ```
 * ```html
 * <div ref="rootRef"> или <MyComponent ref="rootRef">
 * ```
 *
 * - `instance` передаётся в `TInstancePlugin` сразу (до mount).
 * - DOM-элемент передаётся в `TElementPlugin` после mount; сбрасывается при unmount.
 * - Если ref указывает на Vue-компонент — берётся `$el`, иначе используется напрямую.
 */
export function usePluginContainer(plugins: TComponentViewContainer, instance: IComponentView) {
	const elRef = ref<ComponentPublicInstance | Element | null>(null)

	plugins.get(TInstancePlugin)!.instance = instance

	onMounted(() => {
		const raw = elRef.value
		plugins.get(TElementPlugin)!.element =
			(raw as ComponentPublicInstance)?.$el ?? (raw as Element) ?? null
	})

	onUnmounted(() => {
		plugins.get(TElementPlugin)!.element = null
	})

	return elRef
}
