import type { IFrame } from '../../../core'
import type { IPluginBundle } from '../../base/types'
import { TBasePlugin } from '../../base/plugin'
import { TInstancePlugin } from '../instance'
import { toCssValue } from '../../base/css-value'
import type { TFrameStylePluginEvents } from './types'

/**
 * Плагин для управления CSS-стилями Frame (позиционирование + z-index).
 *
 * Подписывается на события TFrame (change:x, change:y, change:width, change:height, change:zIndex)
 * и вычисляет объект стилей для применения к DOM-элементу.
 *
 * @example
 * const bundle = createFrameBundle()
 * const stylePlugin = bundle.get(TFrameStylePlugin)!
 * // stylePlugin.styles → { position: 'fixed', left: '100px', top: '200px', zIndex: 1001 }
 */
export class TFrameStylePlugin extends TBasePlugin<TFrameStylePluginEvents> {
	static readonly key = 'frame-style'

	protected _styles: Record<string, string | number> = {}

	override install(bundle: IPluginBundle): void {
		const instancePlugin = bundle.get(TInstancePlugin) as TInstancePlugin<IFrame> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			const frame = instance as unknown as IFrame

			const update = () => {
				const styles: Record<string, string | number> = {}

				if (frame.x !== undefined && frame.y !== undefined) {
					styles['position'] = 'fixed'
					styles['left'] = toCssValue(frame.x)
					styles['top'] = toCssValue(frame.y)
				}

				if (frame.width !== undefined) {
					styles['width'] = toCssValue(frame.width)
				}

				if (frame.height !== undefined) {
					styles['height'] = toCssValue(frame.height)
				}

				styles['z-index'] = frame.zIndex

				this._styles = styles
				;(this.events as any).emit('change:styles', this._styles)
			}

			frame.events.on('change:x' as any, update)
			frame.events.on('change:y' as any, update)
			frame.events.on('change:width' as any, update)
			frame.events.on('change:height' as any, update)
			frame.events.on('change:zIndex' as any, update)

			// Первичный расчёт
			update()
		})
	}

	/**
	 * Текущий объект стилей для Frame.
	 * Включает position, left, top, width, height, z-index.
	 */
	get styles(): Record<string, string | number> {
		return this._styles
	}
}
