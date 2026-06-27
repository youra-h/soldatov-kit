import type { IList } from '@core'
import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TInstancePlugin } from '../../instance'
import { TCollectionElementsPlugin } from '../../collection'
import type { TListLayoutPluginEvents } from './types'

/**
 * Плагин для управления высотой контейнера List/ListBox в зависимости от maxRows.
 *
 * Вычисляет высоту как сумму высот первых N элементов + (N-1) * gap,
 * где N = getVisibleItemCount().
 * Устанавливает max-height и overflow-y: auto на контейнер.
 */
export class TListLayoutPlugin extends TBasePlugin<TListLayoutPluginEvents> {
	static readonly key = 'list-layout'

	private _element: HTMLElement | null = null
	private _list: IList | null = null
	private _collectionElements: TCollectionElementsPlugin | null = null
	private _rootObserver: ResizeObserver | null = null
	private readonly _itemObservers = new Map<string | number, ResizeObserver>()

	override install(bundle: IPluginBundle): void {
		bundle.get(TElementPlugin)?.events.on('ready', ({ element }) => {
			this._element = element
			this._rootObserver = new ResizeObserver(() => this._updateHeight())
			this._rootObserver.observe(element)
			this._updateHeight()
		})

		bundle.get(TElementPlugin)?.events.on('removed', () => {
			this._rootObserver?.disconnect()
			this._rootObserver = null
			this._element = null
		})

		const instancePlugin = bundle.get(TInstancePlugin) as TInstancePlugin<IList> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._list = instance

			instance.events.on('change:maxRows', () => this._updateHeight())
			instance.events.on('item:added', () => this._updateHeight())
			instance.events.on('item:afterDelete', () => this._updateHeight())
			// instance.events.on('item:present', () => this._updateHeight())
		})

		this._collectionElements = bundle.get(TCollectionElementsPlugin) ?? null

		this._collectionElements?.events.on('element:added', ({ uid, element }) => {
			this._itemObservers.get(uid)?.disconnect()

			const observer = new ResizeObserver(() => this._updateHeight())
			observer.observe(element)

			this._itemObservers.set(uid, observer)
		})

		this._collectionElements?.events.on('element:removed', ({ uid }) => {
			this._itemObservers.get(uid)?.disconnect()
			this._itemObservers.delete(uid)
			this._updateHeight()
		})
	}

	override destroy(): void {
		this._rootObserver?.disconnect()
		this._rootObserver = null

		for (const observer of this._itemObservers.values()) {
			observer.disconnect()
		}

		this._itemObservers.clear()

		this._element = null
		this._list = null
		this._collectionElements = null

		super.destroy()
	}

	/**
	 * Обновляет высоту контейнера списка в зависимости от видимых элементов и их размеров.
	 * @returns void
	 */
	private _updateHeight(): void {
		if (!this._element || !this._list || !this._collectionElements) return

		const visibleElements = this._collectionElements.getVisible()
		const visibleCount = this._list.getVisibleItemCount()

		// Если все элементы видны — сбрасываем стили, скролл не нужен
		if (visibleCount === 0 || visibleCount >= visibleElements.length) {
			this._element.style.maxHeight = ''
			this._element.style.overflowY = ''
			return
		}

		const gap = parseFloat(getComputedStyle(this._element).rowGap) || 0

		let totalHeight = 0
		const limit = Math.min(visibleCount, visibleElements.length)

		for (let i = 0; i < limit; i++) {
			totalHeight += visibleElements[i].offsetHeight
		}

		if (limit > 1) {
			totalHeight += (limit - 1) * gap
		}

		this._element.style.maxHeight = `${totalHeight}px`
		this._element.style.overflowY = 'auto'
	}
}
