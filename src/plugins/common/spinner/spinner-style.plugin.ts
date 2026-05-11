import type { ISpinner } from '../../../core'
import type { IPluginBundle } from '../../base/types'
import { TBasePlugin } from '../../base/plugin'
import { TInstancePlugin } from '../instance'

/**
 * Плагин для управления стилями спиннера.
 */
export class TSpinnerStylePlugin extends TBasePlugin {
	static readonly key = 'spinner-style'

	protected _styles: Record<string, string | number> = {}

	override install(bundle: IPluginBundle): void {
		const instancePlugin = bundle.get(TInstancePlugin) as TInstancePlugin<ISpinner> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			;(instance as unknown as ISpinner).events.on('change:borderWidth', (value) => {
				this._styles['--spinner-border-width'] =
					typeof value === 'number' ? `${value}px` : 'auto'
			})
		})
	}

	get styles(): Record<string, string | number> {
		return this._styles
	}
}
