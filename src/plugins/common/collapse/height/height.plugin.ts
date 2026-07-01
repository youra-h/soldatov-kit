import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TElementAccumulationPlugin } from '../../collection'
import type { IPluginBundle } from '../../../base/types'
import type { TCollapseHeightPluginEvents } from './types'

/**
 * Плагин для отслеживания максимальной высоты раскрытого элемента Collapse.
 * Измеряет высоту каждого item-элемента и обновляет CSS-переменную --s-collapse-item-height,
 * чтобы анимация раскрытия (height: 0 → var(--s-collapse-item-height)) работала корректно.
 */
export class TCollapseHeightPlugin extends TBasePlugin<TCollapseHeightPluginEvents> {
	static readonly key = 'collapse-height'

	private _rootObserver: ResizeObserver | null = null
	private readonly _itemObservers = new Map<string | number, ResizeObserver>()
	private readonly _itemHeights = new Map<string | number, number>()

	override install(bundle: IPluginBundle): void {
		// bundle.get(TElementPlugin)?.events.on('ready', ({ element }) => {
		// 	this._rootObserver = new ResizeObserver(() => this.events.emit('height:change'))
		// 	this._rootObserver.observe(element)
		// })

		// bundle.get(TElementPlugin)?.events.on('removed', () => {
		// 	this._rootObserver?.disconnect()
		// 	this._rootObserver = null
		// })

		// const collectionPlugin = bundle.get(TElementAccumulationPlugin)


		// collectionPlugin?.events.on('element:removed', ({ uid }) => {
		// 	this._itemObservers.get(uid)?.disconnect()
		// 	this._itemObservers.delete(uid)
		// 	this._itemHeights.delete(uid)
		// })
	}

	override destroy(): void {
		// this._rootObserver?.disconnect()
		// this._rootObserver = null

		// for (const observer of this._itemObservers.values()) {
		// 	observer.disconnect()
		// }
		// this._itemObservers.clear()
		// this._itemHeights.clear()

		super.destroy()
	}
}
