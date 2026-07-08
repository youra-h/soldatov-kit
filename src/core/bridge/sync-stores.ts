import type { IEventSource } from '../common/event-emitter'
import { createEventStore, type IReadableStore } from './event-store'

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
export type PropSpecInput<T> = (() => T) | PropSpec<T>

export type PropSpecMap = Record<string, PropSpecInput<any>>

export type SyncStoresResult<TMap extends PropSpecMap> = {
	[K in keyof TMap]: TMap[K] extends () => infer T
		? IReadableStore<T>
		: TMap[K] extends PropSpec<infer T>
			? IReadableStore<T>
			: never
}

/**
 * Создаёт объект IReadableStore из карты свойств, синхронизированных через события.
 * Framework-agnostic аналог `useSyncProps` — не привязан к Vue.
 */
export function createSyncStores<TMap extends PropSpecMap>(
	events: IEventSource,
	map: TMap,
): SyncStoresResult<TMap> {
	const result: Record<string, IReadableStore<any>> = {}

	for (const key in map) {
		const spec = map[key]
		if (typeof spec === 'function') {
			result[key] = createEventStore(events, spec, [`change:${key}`])
		} else {
			result[key] = createEventStore(events, spec.value, spec.triggers)
		}
	}

	return result as SyncStoresResult<TMap>
}
