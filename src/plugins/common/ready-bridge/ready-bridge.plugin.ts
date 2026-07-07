import type { IComponentView } from '@core'
import type { IPluginBundle } from '../../base/types'
import { TBasePlugin } from '../../base/plugin'
import { TElementPlugin } from '../element'
import { TInstancePlugin } from '../instance'

/**
 * Плагин-мост для синхронизации состояния ready между элементом и инстансом компонента.
 * Устанавливает ready в true, когда элемент готов, и в false, когда элемент удаляется.
 * Позволяет компоненту знать, когда он готов к взаимодействию с DOM.
 */
export class TReadyBridgePlugin extends TBasePlugin {
	static readonly key = 'ready-bridge'

	override install(bundle: IPluginBundle): void {
		const elementPlugin = bundle.get(TElementPlugin)

		const instancePlugin = bundle.get(TInstancePlugin) as
			| TInstancePlugin<IComponentView>
			| undefined

		elementPlugin?.events.on('ready', () => {
			if (instancePlugin?.instance) {
				instancePlugin.instance.ready = true
			}
		})

		elementPlugin?.events.on('removed', () => {
			if (instancePlugin?.instance) {
				instancePlugin.instance.ready = false
			}
		})
	}
}
