import type { IList, IListItem } from '@core'
import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TInstancePlugin } from '../../instance'
import { TListItemPlugin } from '../item'
import type { TListKeyboardPluginEvents } from './types'

/**
 * Плагин клавиатурной навигации по списку.
 *
 * Накапливает {@link TListItemPlugin} каждого элемента через `register(uid, bundle)`,
 * обрабатывает ArrowUp/Down для перемещения подсветки и Enter/Space для выбора.
 */
export class TListKeyboardPlugin extends TBasePlugin<TListKeyboardPluginEvents> {
	static readonly key = 'list-keyboard'

	private _element: HTMLElement | null = null
	private _list: IList | null = null
	private readonly _items = new Map<string | number, TListItemPlugin>()
	private _highlightedUid: string | number | null = null

	private readonly _onKeyDown = (e: KeyboardEvent) => {
		if (!this._list) return

		const items = this._list.collection.items as IListItem[]
		if (items.length === 0) return

		const currentIdx =
			this._highlightedUid != null
				? items.findIndex((item) => item.uid === this._highlightedUid)
				: -1

		if (e.key === 'ArrowDown') {
			e.preventDefault()
			const nextIdx = currentIdx < items.length - 1 ? currentIdx + 1 : 0
			this._setHighlight(items[nextIdx].uid)
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			const nextIdx = currentIdx > 0 ? currentIdx - 1 : items.length - 1
			this._setHighlight(items[nextIdx].uid)
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			if (this._highlightedUid != null) {
				const plugin = this._items.get(this._highlightedUid)
				plugin?.toggleSelected()
			}
		}
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

		const instancePlugin = bundle.get(TInstancePlugin) as
			| TInstancePlugin<{ collection: { items: IListItem[] } }>
			| undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._list = instance as unknown as IList
		})
	}

	override destroy(): void {
		this._element?.removeEventListener('keydown', this._onKeyDown)
		this._clearHighlight()
		this._element = null
		this._list = null
		this._items.clear()
		super.destroy()
	}

	/**
	 * Регистрирует дочерний bundle — извлекает из него {@link TListItemPlugin}.
	 */
	register(uid: string | number, bundle: IPluginBundle): void {
		const plugin = bundle.get(TListItemPlugin)
		if (plugin) {
			this._items.set(uid, plugin)
		}
	}

	private _setHighlight(uid: string | number): void {
		if (this._highlightedUid === uid) return

		const prev = this._highlightedUid != null ? this._items.get(this._highlightedUid) : null
		const next = this._items.get(uid)

		prev && (prev.highlighted = false)
		next && (next.highlighted = true)

		this._highlightedUid = uid
		this.events.emit('highlight:change', uid)
	}

	private _clearHighlight(): void {
		if (this._highlightedUid == null) return

		const prev = this._items.get(this._highlightedUid)
		prev && (prev.highlighted = false)

		this._highlightedUid = null
		this.events.emit('highlight:change', null)
	}

	/** uid подсвеченного элемента или null */
	get highlightedUid(): string | number | null {
		return this._highlightedUid
	}
}
