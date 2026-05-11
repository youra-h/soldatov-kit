import { ref, onMounted, onUnmounted, toRaw, type Reactive } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { IComponentView } from '@core'
import { TComponentViewBundle } from '../../plugins/bundles/component-view'
import { TElementPlugin } from '../../plugins/common/element'
import { TInstancePlugin } from '../../plugins/common/instance'

type TComponentViewBundleCtor<T extends TComponentViewBundle> = new () => T

/**
 * Создаёт контейнер плагинов, привязывает core-инстанс через `TInstancePlugin`
 * и синхронизирует root DOM-элемент через `TElementPlugin`.
 *
 * Использование:
 * ```ts
 * const { plugins, rootRef } = usePlugins(TComponentViewBundle, raw)
 *  или с кастомным контейнером:
 * const { plugins, rootRef } = usePlugins(TTabsBundle, raw)
 * ```
 * ```html
 * <div ref="rootRef"> или <MyComponent ref="rootRef">
 * ```
 *
 * - `raw` — сырой (не reactive) core-инстанс.
 * - `instance` передаётся в `TInstancePlugin` сразу (до mount).
 * - DOM-элемент передаётся в `TElementPlugin` после mount; сбрасывается при unmount.
 * - Если ref указывает на Vue-компонент — берётся `$el`, иначе используется напрямую.
 * - После mount эмитится событие `ready` через `TElementPlugin` с `{ element, instance, plugins }`.
 */
export function usePlugins<TBundle extends TComponentViewBundle>(
	BundleCtor: TComponentViewBundleCtor<TBundle>,
	plugins: TBundle | undefined,
	instance: Reactive<IComponentView>,
) {
	const container = (plugins ?? new BundleCtor()) as TBundle
	const elRef = ref<ComponentPublicInstance | Element | null>(null)

	container.get(TInstancePlugin)!.instance = toRaw(instance) as IComponentView

	onMounted(() => {
		const ref = elRef.value
		container.get(TElementPlugin)!.element =
			(ref as ComponentPublicInstance)?.$el ?? (ref as Element) ?? null
	})

	onUnmounted(() => {
		container.get(TElementPlugin)!.element = null
	})

	return { plugins: container, rootRef: elRef }
}
