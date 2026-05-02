import { TPlugin } from '../base/plugin.class'
import { TDomPlugin } from '../dom/dom.plugin'
import type { IPluginContext } from '../base/types'

/**
 * Плагин-транслятор бизнес-логики (instance).
 *
 * Vue передает в него `setContext({ instance })`.
 */
export class TCorePlugin<TInstance = any> extends TPlugin<{ ready: (instance: TInstance) => void }> {
	static readonly key = 'core-plugin'

	override setContext(context: Partial<IPluginContext>): void {
		const prev = this.instance

		super.setContext(context)

		if ('instance' in context && this.instance && this.instance !== prev) {
			this.events.emit('ready', this.instance)
		}
	}

	override uninstall(): void {}
}
