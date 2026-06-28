import type { ISkeleton } from '../../../core'
import type { IPluginBundle } from '../../base/types'
import { TBasePlugin, toCssValue } from '../../base'
import { TInstancePlugin } from '../instance'

/**
 * Плагин для управления стилями скелетона.
 * Вычисляет ширину и высоту placeholder'а на основе size или кастомных width/height.
 */
export class TSkeletonStylePlugin extends TBasePlugin {
	static readonly key = 'skeleton-style'

	protected _styles: Record<string, string | number> = {}

	override install(bundle: IPluginBundle): void {
		const instancePlugin = bundle.get(TInstancePlugin) as TInstancePlugin<ISkeleton> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			const skeleton = instance as unknown as ISkeleton

			skeleton.events.on('change:width', (value) => {
				if (value === 'auto') {
					delete this._styles.width
				} else {
					this._styles.width = toCssValue(value)
				}
			})

			skeleton.events.on('change:height', (value) => {
				if (value === 'auto') {
					delete this._styles.height
				} else {
					this._styles.height = toCssValue(value)
				}
			})
		})
	}

	get styles(): Record<string, string | number> {
		return this._styles
	}
}
