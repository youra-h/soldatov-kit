import type { ISkeleton } from '@core'
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

			this._bindDimension(skeleton, 'width')
			this._bindDimension(skeleton, 'height')
		})
	}

	private _bindDimension(skeleton: ISkeleton, prop: 'width' | 'height'): void {
		const eventName = `change:${prop}` as const

		if (skeleton[prop] !== 'auto') {
			this._styles[prop] = toCssValue(skeleton[prop])
		}

		skeleton.events.on(eventName, (value: number | string) => {
			if (value === 'auto') {
				delete this._styles[prop]
			} else {
				this._styles[prop] = toCssValue(value)
			}
		})
	}

	get styles(): Record<string, string | number> {
		return this._styles
	}
}
