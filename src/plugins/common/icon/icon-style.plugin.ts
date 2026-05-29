import type { IIcon } from '../../../core'
import type { IPluginBundle } from '../../base/types'
import { TBasePlugin } from '../../base/plugin'
import { TInstancePlugin } from '../instance'

/**
 * Плагин для управления стилями иконки.
 */
export class TIconStylePlugin extends TBasePlugin {
	static readonly key = 'icon-style'

	protected _styles: Record<string, string | number> = {}

	override install(bundle: IPluginBundle): void {
		const instancePlugin = bundle.get(TInstancePlugin) as TInstancePlugin<IIcon> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			;(instance as unknown as IIcon).events.on('change:width', (value) => {
				this._styles['width'] = value! && (typeof value === 'number' || parseInt(value)) ? `${value}px` : 'auto'
			})
			;(instance as unknown as IIcon).events.on('change:height', (value) => {
				this._styles['height'] = value! && (typeof value === 'number' || parseInt(value)) ? `${value}px` : 'auto'
			})
		})
	}

	get styles(): Record<string, string | number> {
		return this._styles
	}
}
