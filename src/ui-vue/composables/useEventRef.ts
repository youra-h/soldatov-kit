import { customRef, onUnmounted, type Ref } from 'vue'

interface IEventSource {
	on(event: string, handler: (...args: any[]) => any): void
	off(event: string, handler: (...args: any[]) => any): void
}

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
