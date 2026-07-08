import { type Ref } from 'vue'
import type { IEventSource } from '@core'
import {
	createSyncStores,
	type PropSpec,
	type PropSpecInput,
	type PropSpecMap,
} from '@core'
import { useEventState } from './useEventState'

type SyncPropsResult<TMap extends PropSpecMap> = {
	[K in keyof TMap]: TMap[K] extends () => infer T
		? Ref<T>
		: TMap[K] extends PropSpec<infer T>
			? Ref<T>
			: never
}

/**
 * Создаёт объект реактивных Ref-ов из карты свойств, синхронизированных через события.
 *
 * @example
 * // Краткая форма — событие выводится как `change:<key>`
 * return useSyncProps(instance.events, {
 *   rendered: () => instance.rendered,
 *   visible:  () => instance.visible,
 *   classes:  () => instance.classes.list,
 * })
 *
 * @example
 * // Явная форма — кастомные события или нестандартные имена
 * return useSyncProps(instance.events, {
 *   active: { value: () => instance.active, triggers: ['change:activation'] },
 * })
 */
export function useSyncProps<TMap extends PropSpecMap>(
	events: IEventSource,
	map: TMap,
): SyncPropsResult<TMap> {
	const stores = createSyncStores(events, map)
	const result: Record<string, Ref<any>> = {}

	for (const key in stores) {
		result[key] = useEventState(stores[key])
	}

	return result as SyncPropsResult<TMap>
}
