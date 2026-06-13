import { type Ref } from 'vue'
import type { IEventSource } from '@core'
import { useEventState } from './useEventState'

/** Явная спецификация: кастомный геттер и список событий-триггеров. */
export type PropSpec<T> = {
	value: () => T
	triggers: string[]
}

/**
 * Ввод для одного свойства:
 * - функция `() => T` → событие выводится автоматически как `change:<key>`
 * - объект `{ value, triggers }` → используются явные события
 */
type PropSpecInput<T> = (() => T) | PropSpec<T>

type PropSpecMap = Record<string, PropSpecInput<any>>

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
	const result: Record<string, Ref<any>> = {}

	for (const key in map) {
		const spec = map[key]
		if (typeof spec === 'function') {
			result[key] = useEventState(events, spec, [`change:${key}`])
		} else {
			result[key] = useEventState(events, spec.value, spec.triggers)
		}
	}

	return result as SyncPropsResult<TMap>
}
