import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TElementAccumulationPlugin } from '../../collection'
import type { TTabsLayoutPluginEvents } from './types'

export class TTabsLayoutPlugin extends TBasePlugin<TTabsLayoutPluginEvents> {
	static readonly key = 'tabs-layout'

	private _rootObserver: ResizeObserver | null = null
	private readonly _itemObservers = new Map<string | number, ResizeObserver>()

	override install(bundle: IPluginBundle): void {
		bundle.get(TElementPlugin)?.events.on('ready', ({ element }) => {
			this._rootObserver = new ResizeObserver(() => this.events.emit('layout:change'))
			this._rootObserver.observe(element)
		})

		bundle.get(TElementPlugin)?.events.on('removed', () => {
			this._rootObserver?.disconnect()
			this._rootObserver = null
		})

		// Подписываемся на изменения элементов табов через TElementAccumulationPlugin, чтобы отслеживать изменения их размеров и эмитить событие layout:change для обновления внешнего вида при изменении размера табов (актуально для view: line, чтобы обновлять позицию и размер underline) и при изменении количества табов (для всех видов отображения, т.к. может влиять на перенос табов на другую строку)
		const collectionPlugin = bundle.get(TElementAccumulationPlugin)

		collectionPlugin?.events.on('element:added', ({ uid, element }) => {
			this._itemObservers.get(uid)?.disconnect()

			const observer = new ResizeObserver(() => this.events.emit('layout:change'))
			observer.observe(element)

			this._itemObservers.set(uid, observer)
		})

		collectionPlugin?.events.on('element:removed', ({ uid }) => {
			this._itemObservers.get(uid)?.disconnect()
			this._itemObservers.delete(uid)
		})
	}

	override destroy(): void {
		this._rootObserver?.disconnect()
		this._rootObserver = null

		for (const observer of this._itemObservers.values()) {
			observer.disconnect()
		}
		this._itemObservers.clear()

		super.destroy()
	}
}
