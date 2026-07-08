import { customRef, onUnmounted, type Ref } from 'vue'
import type { IReadableStore } from '@core'

/**
 * Vue-адаптер для `IReadableStore<T>`.
 * Превращает framework-agnostic store в реактивный Vue `Ref`.
 *
 * @param store — read-only store с подпиской (созданный через `createEventStore`).
 * @returns Реактивный `Ref<T>`.
 */
export function useEventState<T>(store: IReadableStore<T>): Ref<T> {
	return customRef<T>((track, trigger) => {
		const dispose = store.subscribe(trigger)

		onUnmounted(dispose)

		return {
			get() {
				track()
				return store.getSnapshot()
			},
			set() {},
		}
	})
}
