import type { IList, IListItem } from '@core'
import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TInstancePlugin } from '../../instance'
import { TListItemAccumulationPlugin } from '../accumulation'
import type { TListKeyboardPluginEvents } from './types'

export class TListKeyboardPlugin extends TBasePlugin<TListKeyboardPluginEvents> {
	static readonly key = 'list-keyboard'

	private _element: HTMLElement | null = null
	private _instance: IList | null = null
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
			this._instance = instance

			const selected = instance.collection.selected
			if (selected.length > 0) {
				this._trackPosition(selected[0].uid)
			}

			instance.events.on('item:selected', ({ item }: { item: IListItem }) => {
				this._trackPosition(item.uid)
			})
		})
	}

	override destroy(): void {
		this._element?.removeEventListener('keydown', this._onKeyDown)
		this._clearHighlight()
		this._element = null
		this._instance = null
		this._itemPluginAccumulation = null
		super.destroy()
	}

	/** Возвращает текущий список элементов из коллекции инстанса. */
	private _getItems(): IListItem[] {
		return (this._instance?.collection.items as IListItem[]) ?? []
	}

	/** Возвращает индекс элемента по uid, или -1 если не найден. */
	private _getIndex(uid: string | number): number {
		return this._getItems().findIndex((item) => item.uid === uid)
	}

	/** Возвращает элемент по индексу, или null если выходит за границы. */
	private _getItemAt(index: number): IListItem | null {
		return this._getItems()[index] ?? null
	}

	/** Возвращает следующий индекс с зацикливанием на начало. */
	private _getNextIndex(currentIdx: number): number {
		const items = this._getItems()
		return currentIdx < items.length - 1 ? currentIdx + 1 : 0
	}

	/** Возвращает предыдущий индекс с зацикливанием на конец. */
	private _getPrevIndex(currentIdx: number): number {
		const items = this._getItems()
		return currentIdx > 0 ? currentIdx - 1 : items.length - 1
	}

	/**
	 * Обрабатывает нажатия клавиш:
	 * - ArrowDown / ArrowUp — перемещают подсветку по списку с зацикливанием
	 * - Enter / Space — выбирают подсвеченный элемент
	 */
	private readonly _onKeyDown = (e: KeyboardEvent) => {
		if (!this._instance) return

		const items = this._getItems()
		if (items.length === 0) return

		const currentIdx = this._highlightedUid != null ? this._getIndex(this._highlightedUid) : -1

		const isNav = e.key === 'ArrowDown' || e.key === 'ArrowUp'
		const isSelect = e.key === 'Enter' || e.key === ' '

		if (!isNav && !isSelect) return

		e.preventDefault()

		if (e.key === 'ArrowDown') {
			const ind = this._getNextIndex(currentIdx)
			this._setHighlight(items[ind].uid)
		} else if (e.key === 'ArrowUp') {
			const ind = this._getPrevIndex(currentIdx)
			this._setHighlight(items[ind].uid)
		} else if (this._highlightedUid != null) {
			this._itemPluginAccumulation?.getByUid(this._highlightedUid)?.toggleSelected()
		}
	}

	/** Возвращает плагин элемента по uid. */
	private _getItemPlugin(uid: string | number) {
		return this._itemPluginAccumulation?.getByUid(uid)
	}

	/** Устанавливает подсветку: обновляет позицию и применяет визуальный класс. */
	private _setHighlight(uid: string | number): void {
		this._trackPosition(uid)
		this._applyVisualHighlight(uid)
	}

	/**
	 * Запоминает позицию подсветки и эмитит `change:highlight`.
	 * Снимает визуальный класс с предыдущего элемента.
	 * Не вызывает повторный emit если uid не изменился.
	 */
	private _trackPosition(uid: string | number): void {
		if (this._highlightedUid === uid) return

		const prevPlugin =
			this._highlightedUid != null ? this._getItemPlugin(this._highlightedUid) : null
		prevPlugin && (prevPlugin.highlighted = false)

		this._highlightedUid = uid

		const idx = this._getIndex(uid)

		this.events.emit('change:highlight', {
			item: this._getItemAt(idx),
			prevItem: this._getItemAt(idx - 1),
			nextItem: this._getItemAt(idx + 1),
		})
	}

	/** Применяет визуальную подсветку (data-highlighted) к элементу по uid. */
	private _applyVisualHighlight(uid: string | number): void {
		const plugin = this._getItemPlugin(uid)
		plugin && (plugin.highlighted = true)
	}

	/** Сбрасывает подсветку: снимает визуальный класс и эмитит `change:highlight` с null. */
	private _clearHighlight(): void {
		if (this._highlightedUid == null) return

		const prev = this._getItemPlugin(this._highlightedUid)
		prev && (prev.highlighted = false)

		this._highlightedUid = null
		this.events.emit('change:highlight', { item: null, prevItem: null, nextItem: null })
	}

	get highlightedUid(): string | number | null {
		return this._highlightedUid
	}
}
