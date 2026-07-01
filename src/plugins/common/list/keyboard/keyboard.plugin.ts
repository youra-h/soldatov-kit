import type { IList, IListItem } from '@core'
import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TInstancePlugin } from '../../instance'
import { TListItemAccumulationPlugin } from '../accumulation'
import type { TListKeyboardPluginEvents } from './types'

/**
 * Плагин клавиатурной навигации по списку.
 *
 * Получает {@link TListItemPlugin} каждого элемента через {@link TListItemAccumulationPlugin},
 * обрабатывает ArrowUp/Down для перемещения подсветки и Enter/Space для выбора.
 *
 * Подсветка синхронизируется с выделением:
 * - при инициализации подсвечивается первый выбранный элемент (если есть)
 * - при клике или программном изменении выделения (`item:selected`)
 *   подсветка переходит на выбранный элемент
 * - клавиши ArrowUp/ArrowDown перемещают подсветку относительно текущего
 *   выделенного элемента
 */
export class TListKeyboardPlugin extends TBasePlugin<TListKeyboardPluginEvents> {
	static readonly key = 'list-keyboard'

	private _element: HTMLElement | null = null
	private _list: IList | null = null
	private _itemPluginAccumulation: TListItemAccumulationPlugin | null = null
	private _highlightedUid: string | number | null = null

	override install(bundle: IPluginBundle): void {
		this._itemPluginAccumulation = bundle.get(TListItemAccumulationPlugin) ?? null

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

			// При инициализации запомнить позицию без визуальной подсветки
			const selected = instance.collection.selected

			if (selected.length > 0) {
				this._trackPosition(selected[0].uid)
			}

			// Запомнить позицию при клике/программном выделении (визуал только от стрелок)
			instance.events.on('item:selected', ({ item }: { item: IListItem }) => {
				this._trackPosition(item.uid)
			})
		})
	}

	override destroy(): void {
		this._element?.removeEventListener('keydown', this._onKeyDown)
		this._clearHighlight()
		this._element = null
		this._list = null
		this._itemPluginAccumulation = null
		super.destroy()
	}

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
				this._itemPluginAccumulation?.getByUid(this._highlightedUid)?.toggleSelected()
			}
		}
	}

	private _getItemPlugin(uid: string | number) {
		return this._itemPluginAccumulation?.getByUid(uid)
	}

	/**
	 * Установить подсветку на элемент с указанным uid.
	 * Запоминает позицию подсветки и снимает визуал с предыдущей.
	 * Визуально подсвечивает элемент (data-highlighted).
	 * @param uid
	 */
	private _setHighlight(uid: string | number) {
		this._trackPosition(uid)
		this._applyVisualHighlight(uid)
	}

	/** Запомнить позицию подсветки и снять визуал с предыдущей. */
	private _trackPosition(uid: string | number): void {
		if (this._highlightedUid === uid) return

		// Снять визуальную подсветку с предыдущего
		const prev = this._highlightedUid != null ? this._getItemPlugin(this._highlightedUid) : null
		prev && (prev.highlighted = false)

		this._highlightedUid = uid
		this.events.emit('highlight:change', uid)
	}

	/** Визуально подсветить элемент (data-highlighted). */
	private _applyVisualHighlight(uid: string | number): void {
		const plugin = this._getItemPlugin(uid)
		plugin && (plugin.highlighted = true)
	}

	private _clearHighlight(): void {
		if (this._highlightedUid == null) return

		const prev = this._getItemPlugin(this._highlightedUid)
		prev && (prev.highlighted = false)

		this._highlightedUid = null
		this.events.emit('highlight:change', null)
	}

	/** uid подсвеченного элемента или null */
	get highlightedUid(): string | number | null {
		return this._highlightedUid
	}
}
