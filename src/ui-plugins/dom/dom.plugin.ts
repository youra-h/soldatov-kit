import { TPlugin } from '../base/plugin.class'
import type { IPluginContext } from '../base/types'

/**
 * Плагин-транслятор DOM-элемента.
 *
 * Vue передает в него `setContext({ el })`.
 * Затем этот плагин сообщает всем остальным плагинам о том, что `el` смонтирован/удален.
 */
export class TDomPlugin extends TPlugin<{ mount: (el: Element) => void; unmount: () => void }> {
	static readonly key = 'dom-plugin'

	override setContext(context: Partial<IPluginContext>): void {
		const prev = this.el

		// Обновляем this.el (из базового плагина)
		super.setContext(context)

		// Если `el` реально изменился и пришел от Vue - эмитим события для других плагинов
		if ('el' in context && this.el !== prev) {
			if (this.el) {
				requestAnimationFrame(() => {
					if (this.el) this.events.emit('mount', this.el)
				})
			} else {
				this.events.emit('unmount')
			}
		}
	}

	override uninstall(): void {}
}
