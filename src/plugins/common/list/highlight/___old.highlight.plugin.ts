import type { IList, IListItem } from '@core'
import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TInstancePlugin } from '../../instance'
import { TCollectionElementsPlugin } from '../../collection'
import type { TListHighlightPluginEvents } from './types'

const BUTTON_SELECTOR = '.s-button'

/**
 * Плагин для навигации по списку с клавиатуры (ArrowUp / ArrowDown).
 *
 * Устанавливает `aria-current="true"` на кнопку подсвеченного элемента,
 * что через SCSS даёт hover-подобные цвета.
 *
 * В отличие от `selected`, подсветка — это навигационное состояние,
 * которое сбрасывается при потере фокуса и не влияет на модель.
 */
export class TListHighlightPlugin extends TBasePlugin<TListHighlightPluginEvents> {
	static readonly key = 'list-highlight'

	private _element: HTMLElement | null = null
	private _list: IList | null = null
	private _collectionElements: TCollectionElementsPlugin | null = null
	private _highlightedUid: string | number | null = null

	private readonly _onKeyDown = (e: KeyboardEvent) => {
		if (!this._list) return

		const items = this._list.collection.items
		if (items.length === 0) return

		const currentIdx = this._highlightedUid != null
			? items.findIndex((item) => (item as IListItem).uid === this._highlightedUid)
			: -1

		let nextIdx: number

		if (e.key === 'ArrowDown') {
			nextIdx = currentIdx < items.length - 1 ? currentIdx + 1 : 0
		} else if (e.key === 'ArrowUp') {
			nextIdx = currentIdx > 0 ? currentIdx - 1 : items.length - 1
		} else {
			return
		}

		e.preventDefault()

		const nextItem = items[nextIdx] as IListItem
		this._setHighlight(nextItem.uid)
	}

	override install(bundle: IPluginBundle): void {
		bundle.get(TElementPlugin)?.events.on('ready', ({ element }) => {
			this._element = element
			element.addEventListener('keydown', this._onKeyDown)
		})

		bundle.get(TElementPlugin)?.events.on('removed', () => {
			this._element?.removeEventListener('keydown', this._onKeyDown)
			this._element = null
		})

		const instancePlugin = bundle.get(TInstancePlugin) as TInstancePlugin<IList> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._list = instance
		})

		this._collectionElements = bundle.get(TCollectionElementsPlugin) ?? null
	}

	override destroy(): void {
		this._element?.removeEventListener('keydown', this._onKeyDown)
		this._clearHighlight()
		this._element = null
		this._list = null
		this._collectionElements = null
		super.destroy()
	}

	private _setHighlight(uid: string | number): void {
		if (this._highlightedUid === uid) return

		this._clearButtonAttr()

		this._highlightedUid = uid

		this._setButtonAttr(uid, 'aria-current', 'true')

		this.events.emit('highlight:change', uid)
	}

	private _clearHighlight(): void {
		if (this._highlightedUid == null) return

		this._clearButtonAttr()

		this._highlightedUid = null

		this.events.emit('highlight:change', null)
	}

	private _setButtonAttr(uid: string | number, attr: string, value: string): void {
		const el = this._collectionElements?.getByUid(uid)
		const button = el?.querySelector(BUTTON_SELECTOR)
		button?.setAttribute(attr, value)
	}

	private _clearButtonAttr(): void {
		if (this._highlightedUid == null) return

		const el = this._collectionElements?.getByUid(this._highlightedUid)
		const button = el?.querySelector(BUTTON_SELECTOR)
		button?.removeAttribute('aria-current')
	}

	/** uid подсвеченного элемента или null */
	get highlightedUid(): string | number | null {
		return this._highlightedUid
	}
}
