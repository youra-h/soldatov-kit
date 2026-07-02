import type { IList, IListItem, TScrollBehavior } from '@core'
import { frameDebounce } from '@core'
import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TInstancePlugin } from '../../instance'
import { TElementAccumulationPlugin } from '../../collection'
import { TListKeyboardPlugin } from '../keyboard'
import type { TListScrollPluginEvents } from './types'

/**
 * Плагин для автоматической прокрутки контейнера списка к выделенному элементу.
 *
 * Реагирует на событие `item:selected` и скроллит контейнер так,
 * чтобы выбранный элемент оказался в видимой области.
 * При массовом выделении (например, 50 из 100 элементов)
 * используется `frameDebounce` — за один кадр выполняется только
 * последний запрос, что предотвращает «прыгающий» скролл.
 *
 * Поведение управляется свойством `scrollBehavior` экземпляра списка:
 * - `'none'` — скролл не выполняется
 * - `'instant'` — мгновенный скролл без анимации
 * - `'smooth'` — плавная анимация скролла
 */
export class TListScrollPlugin extends TBasePlugin<TListScrollPluginEvents> {
	static readonly key = 'list-scroll'

	private _element: HTMLElement | null = null
	private _list: IList | null = null
	private _collectionElements: TElementAccumulationPlugin | null = null
	private readonly _scheduleScroll: (payload: {
		uid: string | number
		mode: 'center' | 'nearest'
	}) => void

	constructor() {
		super()
		this._scheduleScroll = frameDebounce(
			({ uid, mode }: { uid: string | number; mode: 'center' | 'nearest' }) =>
				this._scrollToItem(uid, mode),
		)
	}

	override install(bundle: IPluginBundle): void {
		bundle.get(TElementPlugin)?.events.on('ready', ({ element }) => {
			this._element = element
		})

		bundle.get(TElementPlugin)?.events.on('removed', () => {
			this._element = null
		})

		const instancePlugin = bundle.get(TInstancePlugin) as TInstancePlugin<IList> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._list = instance

			const selected = instance.collection.selected

			if (selected.length > 0) {
				this._scrollToItem(selected[0].uid, 'center')
			}

			instance.events.on('item:selected', ({ item }: { item: IListItem }) => {
				this._scheduleScroll({ uid: item.uid, mode: 'center' })
			})
		})

		this._collectionElements = bundle.get(TElementAccumulationPlugin) ?? null

		const keyboardPlugin = bundle.get(TListKeyboardPlugin) ?? null

		keyboardPlugin?.events.on('change:highlight', ({ item }) => {
			if (item) {
				this._scheduleScroll({ uid: item.uid, mode: 'nearest' })
			}
		})
	}

	override destroy(): void {
		this._element = null
		this._list = null
		this._collectionElements = null

		super.destroy()
	}

	/**
	 * Скроллит контейнер к элементу с указанным uid.
	 * - `center` — центрирует элемент (для `item:selected`)
	 * - `nearest` — минимальный скролл до видимости (для `change:highlight`)
	 * Если scrollBehavior === 'none' — ничего не делает.
	 */
	private _scrollToItem(uid: string | number, mode: 'center' | 'nearest'): void {
		if (!this._element || !this._list) return

		const behavior: TScrollBehavior = this._list.scrollBehavior

		if (behavior === 'none') return

		const targetElement = this._collectionElements?.getByUid(uid)

		if (!targetElement) return

		// Если mode === 'nearest', используем scrollIntoView с block: 'nearest'.
		// В случае прокручивания блока, когда мы используем клавиши up/down, это предотвращает «прыгающий» скролл, когда элемент уже виден.
		if (mode === 'nearest') {
			targetElement.scrollIntoView({
				block: 'nearest',
				behavior: behavior === 'instant' ? 'instant' : 'smooth',
			})
			return
		}

		if (this._isFullyVisible(targetElement)) return

		const container = this._element
		const containerRect = container.getBoundingClientRect()
		const targetRect = targetElement.getBoundingClientRect()

		const scrollTop =
			container.scrollTop + (targetRect.top - containerRect.top) - container.clientHeight / 2

		container.scrollTo({
			top: scrollTop,
			behavior: behavior === 'instant' ? 'instant' : 'smooth',
		})
	}

	/**
	 * Проверяет, что элемент полностью помещается в видимой области контейнера.
	 */
	private _isFullyVisible(el: HTMLElement): boolean {
		if (!this._element) return false

		const containerRect = this._element.getBoundingClientRect()
		const targetRect = el.getBoundingClientRect()

		return targetRect.top >= containerRect.top && targetRect.bottom <= containerRect.bottom
	}
}
