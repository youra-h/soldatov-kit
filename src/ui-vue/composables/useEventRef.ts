import { customRef, onUnmounted, type Ref } from 'vue'
import type { IEventSource } from '@core'

/**
 * Возвращает реактивный `Ref`, который обновляется при срабатывании указанных событий.
 *
 * Решает проблему: мутации внутри классов происходят на raw-объекте, минуя Vue Proxy.
 * Вместо отслеживания через proxy используется ручной `track`/`trigger` через события.
 *
 * @param events        Источник событий (`TEvented`, `TEventEmitter` или любой `IEventSource`).
 * @param getter        Функция, возвращающая актуальное значение при каждом чтении.
 * @param triggerEvents Список имён событий, при которых `Ref` должен обновиться.
 * @returns Реактивный `Ref<T>`.
 */
export function useEventRef<T>(
	events: IEventSource,
	getter: () => T,
	triggerEvents: string[],
): Ref<T> {
	let _trigger: () => void

	const ref = customRef<T>((track, trigger) => {
		_trigger = trigger

		return {
			get() {
				track()
				return getter()
			},
			set() {},
		}
	})

	for (const event of triggerEvents) {
		events.on(event, _trigger!)
	}

	onUnmounted(() => {
		for (const event of triggerEvents) {
			events.off(event, _trigger!)
		}
	})

	return ref
}
