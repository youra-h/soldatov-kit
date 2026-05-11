import type { IComponentView } from '../../../core'
import type { IPluginBundle } from '../../base/types'
import { TBasePlugin } from '../../base/plugin'
import { TElementPlugin } from '../element'
import { TInstancePlugin } from '../instance'

/**
 * Плагин для управления стилями спиннера.
 */
export class TSpinnerStylePlugin extends TBasePlugin {
	static readonly key = 'spinner-style'

	override install(bundle: IPluginBundle): void {
		const elementPlugin = bundle.get(TElementPlugin)

		const instancePlugin = bundle.get(TInstancePlugin) as
			| TInstancePlugin<IComponentView>
			| undefined

		elementPlugin?.events.on('ready', () => {

		})
	}
}
