import type { IEventSource } from '../common/event-emitter'

export interface IReadableStore<T> {
	getSnapshot(): T
	subscribe(listener: () => void): () => void
}

export function createEventStore<T>(
	events: IEventSource,
	getter: () => T,
	triggerEvents: string[],
): IReadableStore<T> {
	const listeners = new Set<() => void>()

	const notify = () => {
		for (const cb of listeners) cb()
	}

	for (const event of triggerEvents) {
		events.on(event, notify)
	}

	return {
		getSnapshot() {
			return getter()
		},
		subscribe(listener) {
			listeners.add(listener)
			return () => {
				listeners.delete(listener)
				if (listeners.size === 0) {
					for (const event of triggerEvents) {
						events.off(event, notify)
					}
				}
			}
		},
	}
}
