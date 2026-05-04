import { ref, onMounted, onUnmounted, toRaw, type UnwrapNestedRefs } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { IComponentView } from '@core'
import { TComponentViewContainer } from '../../plugins/containers/component-view'
import { TElementPlugin } from '../../plugins/common/element'
import { TInstancePlugin } from '../../plugins/common/instance'

type TComponentViewContainerCtor<T extends TComponentViewContainer> = new () => T

/**
 * Создаёт контейнер плагинов, привязывает core-инстанс через `TInstancePlugin`
 * и синхронизирует root DOM-элемент через `TElementPlugin`.
 *
 * Использование:
 * ```ts
 * const { plugins, rootRef } = usePlugins(TComponentViewContainer, raw)
 *  или с кастомным контейнером:
 * const { plugins, rootRef } = usePlugins(TTabsContainer, raw)
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
export function usePlugins<TContainer extends TComponentViewContainer>(
	ContainerCtor: TComponentViewContainerCtor<TContainer>,
	plugins: TContainer | undefined,
	raw: IComponentView | UnwrapNestedRefs<IComponentView>,
) {
	const container = plugins ?? new ContainerCtor()
	const elRef = ref<ComponentPublicInstance | Element | null>(null)
	const rawInstance = toRaw(raw) as IComponentView

	container.get(TInstancePlugin)!.instance = rawInstance

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
