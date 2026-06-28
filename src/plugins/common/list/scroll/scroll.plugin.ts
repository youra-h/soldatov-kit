import type { IList, IListItem, TScrollBehavior } from '@core'
import { frameDebounce } from '@core'
import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TInstancePlugin } from '../../instance'
import { TCollectionElementsPlugin } from '../../collection'
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
	private _collectionElements: TCollectionElementsPlugin | null = null
	private readonly _scheduleScroll: (uid: string | number) => void

	constructor() {
		super()
		this._scheduleScroll = frameDebounce((uid: string | number) => this._scrollToItem(uid))
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

			// Если при инициализации уже есть выделенные элементы — скроллим к первому
			const selected = instance.collection.selected

			if (selected.length > 0) {
				this._scrollToItem(selected[0].uid)
			}

			instance.events.on('item:selected', ({ item }: { item: IListItem }) => {
				this._scheduleScroll(item.uid)
			})
		})

		this._collectionElements = bundle.get(TCollectionElementsPlugin) ?? null
	}

	override destroy(): void {
		this._element = null
		this._list = null
		this._collectionElements = null

		super.destroy()
	}

	/**
	 * Скроллит контейнер к элементу с указанным uid.
	 * Если элемент уже полностью виден в контейнере — не скроллит (пользовательский клик).
	 * Если scrollBehavior === 'none' — ничего не делает.
	 */
	private _scrollToItem(uid: string | number): void {
		if (!this._element || !this._list) return

		const behavior: TScrollBehavior = this._list.scrollBehavior

		if (behavior === 'none') return

		const targetElement = this._collectionElements?.getByUid(uid)

		if (!targetElement) return

		// Элемент уже полностью виден — не трогаем скролл (пользовательский клик)
		if (this._isFullyVisible(targetElement)) return

		targetElement.scrollIntoView({
			behavior,
			block: 'center',
		})
	}

	/**
	 * Проверяет, что элемент полностью помещается в видимой области контейнера.
	 */
	private _isFullyVisible(el: HTMLElement): boolean {
		if (!this._element) return false

		const c = this._element.getBoundingClientRect()
		const e = el.getBoundingClientRect()

		return e.top >= c.top && e.bottom <= c.bottom
	}
}
