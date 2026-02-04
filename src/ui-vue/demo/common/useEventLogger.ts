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
