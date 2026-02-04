import { onMounted } from 'vue'
import type { EventLogEntry } from '../EventLog.vue'

/**
 * Композабл для создания обработчиков событий компонента с логированием
 *
 * @param emit - функция emit из setup
 * @param extraEvents - дополнительные события специфичные для компонента
 *
 * @example
 * ```ts
 * // Базовое использование (ComponentView)
 * const { handlers } = useEventLogger(emit)
 *
 * // С дополнительными событиями (Button)
 * const { handlers } = useEventLogger(emit, {
 *   click: () => {},
 *   focus: () => {},
 *   blur: () => {}
 * })
 * ```
 */
export function useEventLogger(
	emit: (event: 'log', entry: EventLogEntry) => void,
	extraEvents?: Record<string, (payload?: any) => void>,
) {
	const logEvent = (source: EventLogEntry['source'], name: string, payload?: unknown) => {
		emit('log', {
			timestamp: new Date().toISOString(),
			source,
			name,
			payload,
		})
	}

	// Базовые события ComponentView (присущи всем компонентам)
	const baseHandlers = {
		onCreated: () => logEvent('vue', 'created'),
		onBeforeShow: () => logEvent('vue', 'beforeShow'),
		onAfterShow: () => logEvent('vue', 'afterShow'),
		onBeforeHide: () => logEvent('vue', 'beforeHide'),
		onAfterHide: () => logEvent('vue', 'afterHide'),
		onShow: () => logEvent('vue', 'show'),
		onHide: () => logEvent('vue', 'hide'),
		onChangeVisible: (v: boolean) => logEvent('vue', 'change:visible', v),
		onChangeRendered: (v: boolean) => logEvent('vue', 'change:rendered', v),
	}

	// Дополнительные события (если переданы)
	const extraHandlers: Record<string, any> = {}
	if (extraEvents) {
		Object.entries(extraEvents).forEach(([eventName, handler]) => {
			const handlerName = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`
			extraHandlers[handlerName] = (payload?: any) => {
				logEvent('vue', eventName, payload)
				handler?.(payload)
			}
		})
	}

	return {
		handlers: { ...baseHandlers, ...extraHandlers },
		logEvent, // на случай если нужно логировать что-то кастомное
	}
}

/**
 * Композабл для автоматической подписки на события core instance
 *
 * @param instance - reactive instance (TComponentView, TIcon и т.д.)
 * @param logEvent - функция логирования событий
 * @param extraEvents - дополнительные события специфичные для компонента
 *
 * @example
 * ```ts
 * // Базовое использование (ComponentView, Icon)
 * const { logEvent } = useEventLogger(emit)
 * useCoreEventLogger(instance, logEvent)
 *
 * // С дополнительными событиями (Button)
 * useCoreEventLogger(instance, logEvent, ['click', 'focus', 'blur'])
 * ```
 */
export function useCoreEventLogger(
	instance: any,
	logEvent: (source: EventLogEntry['source'], name: string, payload?: unknown) => void,
	extraEvents?: string[],
) {
	// Базовые события ComponentView (присущи всем компонентам)
	const baseEvents = [
		'created',
		'beforeShow',
		'afterShow',
		'beforeHide',
		'afterHide',
		'show',
		'hide',
		'change:visible',
		'change:rendered',
	]

	const allEvents = extraEvents ? [...baseEvents, ...extraEvents] : baseEvents

	onMounted(() => {
		allEvents.forEach((eventName) => {
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
