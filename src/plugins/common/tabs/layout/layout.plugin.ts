import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import type { TTabsLayoutPluginEvents } from './types'

export class TTabsLayoutPlugin extends TBasePlugin<TTabsLayoutPluginEvents> {
	static readonly key = 'tabs-layout'

	private _observer: ResizeObserver | null = null

	override install(bundle: IPluginBundle): void {
		bundle.get(TElementPlugin)?.events.on('ready', ({ element }) => {
			this._observer = new ResizeObserver(() => {
				this.events.emit('layout:change')
			})
			this._observer.observe(element)
		})

		bundle.get(TElementPlugin)?.events.on('removed', () => {
			this._observer?.disconnect()
			this._observer = null
		})
	}

	override destroy(): void {
		this._observer?.disconnect()
		this._observer = null
		super.destroy()
	}
}
