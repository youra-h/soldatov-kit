import { onMounted } from 'vue'
import type { EventLogEntry } from './EventLog.vue'

/**
 * Композабл для создания обработчиков событий компонента с логированием
 *
 * @param emit - функция emit из setup
 * @param vueEmits - массив событий компонента (например, emitsComponentView, emitsIcon)
 *
 * @example
 * ```ts
 * // Базовое использование (ComponentView)
 * import { emitsComponentView } from '@ui/component-view'
 * const { handlers } = useEventLogger(emit, emitsComponentView)
 *
 * // Для Icon
 * import { emitsIcon } from '@ui/icon'
 * const { handlers } = useEventLogger(emit, emitsIcon)
 * ```
 */
export function useEventLogger(
	emit: (event: 'log', entry: EventLogEntry) => void,
	vueEmits: readonly string[],
) {
	const logEvent = (source: EventLogEntry['source'], name: string, payload?: unknown) => {
		emit('log', {
			timestamp: new Date().toISOString(),
			source,
			name,
			payload,
		})
	}

	// Генерируем обработчики для всех событий из emits
	const handlers: Record<string, any> = {}

	vueEmits.forEach((eventName) => {
		// Конвертируем event-name в onEventName
		const handlerName = `on${eventName
			.split(':')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join('')
			.replace(/^On/, 'on')}`

		handlers[handlerName] = (payload?: any) => {
			logEvent('vue', eventName, payload)
		}
	})

	return {
		handlers,
		logEvent, // на случай если нужно логировать что-то кастомное
	}
}

/**
 * Композабл для автоматической подписки на события core instance
 *
 * @param instance - reactive instance (TComponentView, TIcon и т.д.)
 * @param logEvent - функция логирования событий
 * @param coreEmits - массив событий компонента (например, emitsComponentView, emitsIcon)
 *
 * @example
 * ```ts
 * // Базовое использование (ComponentView)
 * import { emitsComponentView } from '@ui/component-view'
 * const { logEvent } = useEventLogger(emit, emitsComponentView)
 * useCoreEventLogger(instance, logEvent, emitsComponentView)
 *
 * // Для Icon
 * import { emitsIcon } from '@ui/icon'
 * const { logEvent } = useEventLogger(emit, emitsIcon)
 * useCoreEventLogger(instance, logEvent, emitsIcon)
 * ```
 */
export function useCoreEventLogger(
	instance: any,
	logEvent: (source: EventLogEntry['source'], name: string, payload?: unknown) => void,
	coreEmits: readonly string[],
) {
	onMounted(() => {
		coreEmits.forEach((eventName) => {
			instance.events.on(eventName as any, (payload?: any) => {
				logEvent('core', eventName, payload)

				// Для beforeShow/beforeHide нужно вернуть true (можно отменить событие)
				if (eventName === 'beforeShow' || eventName === 'beforeHide') {
					return true
				}
			})
		})
	})
}
