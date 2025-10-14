import type { TConstructor } from '../../../common/types'
import type { TCollectionOwned } from '../collection-owned.class'
import type { TCollectionItem } from '../collection-item.class'
import type { ISelectableCollection, TIndexOrItem } from './types'

type BaseCtorArgs = [owner?: any, itemClass?: any, opts?: { multi?: boolean }]

/**
 * Mixin, который добавляет в коллекцию поведение выбора элементов.
 * Base должен быть классом коллекции, реализующим базовые методы:
 *  - add()/insert()/delete()/clear()/getItem(index)/count/forEach()
 *
 * @template TBase - базовый тип коллекции
 * @template TItem - тип элемента коллекции
 * @param Base - базовый класс коллекции
 * @returns Класс, расширяющий базу поведением выбора
 */
export function SelectableCollectionMixin<
	TBase extends TConstructor<TCollectionOwned>,
	TItem extends TCollectionItem = TCollectionItem,
>(Base: TBase) {
	return class TSelectableCollection
		extends (Base as any)
		implements ISelectableCollection<TItem>
	{
		/** Флаг множественного выбора (true — можно выбрать несколько) */
		protected _multiSelect: boolean

		/** Массив выбранных элементов (ссылки на сами элементы) */
		protected _selectedItems: TItem[] = []

		/**
		 * Конструктор коллекции с поддержкой выбора.
		 * @param args[0] owner - владелец коллекции
		 * @param args[1] itemClass - класс элемента
		 * @param args[2] opts - настройки (multi: boolean)
		 */
		constructor(...args: BaseCtorArgs) {
			const owner = args[0]
			const itemClass = args[1]
			super(owner, itemClass)

			const opts = args[2] || {}
			this._multiSelect = !!opts.multi
		}

		get multiSelect(): boolean {
			return this._multiSelect
		}

		set multiSelect(value: boolean) {
			if (this._multiSelect === !!value) return

			this._multiSelect = !!value

			if (!value && this._selectedItems.length > 1) {
				// Переход в single-select — оставляем выбранным только первый
				const first = this._selectedItems[0]

				for (const it of this._selectedItems.slice(1)) {
					;(it as any).selected = false
				}

				this._selectedItems.length = 0

				if (first) {
					this._selectedItems.push(first)
				}
			}
		}

		/**
		 * Возвращает массив выбранных элементов.
		 * @returns массив выбранных элементов
		 */
		get selectedItems(): TItem[] {
			return this._selectedItems
		}

		/**
		 * Возвращает массив выбранных элементов
		 * @returns массив выбранных элементов
		 */
		getSelected(): TItem[] {
			return this._selectedItems
		}

		/**
		 * Возвращает единственный выбранный элемент (если multiSelect = false), иначе undefined.
		 * @returns выбранный элемент или undefined
		 */
		getSingleSelected(): TItem | undefined {
			if (this._multiSelect) return undefined

			return this._selectedItems[0]
		}

		/**
		 * Преобразует индекс или элемент в сам элемент коллекции.
		 * @param itemOrIndex - индекс или элемент
		 * @returns элемент коллекции или undefined
		 */
		protected _normalize(itemOrIndex: TIndexOrItem<TItem>): TItem | undefined {
			if (typeof itemOrIndex === 'number') {
				return (this as any).getItem(itemOrIndex) as TItem | undefined
			}

			return itemOrIndex as TItem | undefined
		}

		/**
		 * Проверяет, выбран ли элемент.
		 * @param itemOrIndex - индекс или элемент
		 * @returns true, если элемент выбран
		 */
		isSelected(itemOrIndex: TIndexOrItem<TItem>): boolean {
			const it = this._normalize(itemOrIndex)

			if (!it) return false

			return this._selectedItems.indexOf(it) !== -1
		}

		/**
		 * Выбирает элемент. В режиме single-select снимает выбор с других.
		 * @param itemOrIndex - индекс или элемент
		 */
		select(itemOrIndex: TIndexOrItem<TItem>): void {
			const it = this._normalize(itemOrIndex)

			if (!it || this.isSelected(it)) return

			if (!this._multiSelect) {
				for (const prev of this._selectedItems.slice()) {
					;(prev as any).selected = false
				}
				this._selectedItems.length = 0
			}

			;(it as any).selected = true
			this._selectedItems.push(it)
		}

		/**
		 * Снимает выбор с элемента.
		 * @param itemOrIndex - индекс или элемент
		 */
		deselect(itemOrIndex: TIndexOrItem<TItem>): void {
			const it = this._normalize(itemOrIndex)

			if (!it) return

			const idx = this._selectedItems.indexOf(it)

			if (idx === -1) {
				;(it as any).selected = false
				return
			}

			this._selectedItems.splice(idx, 1)
		}

		/**
		 * Переключает состояние выбора элемента.
		 * @param itemOrIndex - индекс или элемент
		 */
		toggle(itemOrIndex: TIndexOrItem<TItem>): void {
			const it = this._normalize(itemOrIndex)

			if (!it) return

			if (this.isSelected(it)) {
				this.deselect(it)
			} else {
				this.select(it)
			}
		}

		/**
		 * Выбирает все элементы коллекции (только в режиме multi-select).
		 * В режиме single-select выбирает только первый.
		 */
		selectAll(): void {
			if (!this._multiSelect) {
				const it = (this as any).getItem(0) as TItem | undefined

				if (it) {
					this.select(it)
				}

				return
			}

			;(this as any).forEach((item: TItem) => {
				if (!this.isSelected(item)) {
					;(item as any).selected = true
					this._selectedItems.push(item)
				}
			})
		}

		/**
		 * Снимает выбор со всех элементов.
		 */
		clearSelection(): void {
			for (const it of this._selectedItems.slice()) {
				;(it as any).selected = false
			}

			this._selectedItems.length = 0
		}

		/**
		 * Внутренний хук — вызывается при удалении элемента из коллекции.
		 * Удаляет элемент из массива выбранных.
		 * @param item - удаляемый элемент
		 */
		protected _onItemRemovedHook(item: TItem): void {
			const idx = this._selectedItems.indexOf(item)

			if (idx !== -1) {
				this._selectedItems.splice(idx, 1)
			}
		}

		/**
		 * Удаляет элемент по индексу и синхронизирует выбор.
		 * @param index - индекс элемента
		 * @return true, если элемент был удалён, false если индекс вне диапазона
		 */
		delete(index: number): boolean {
			const item = (this as any).getItem(index) as TItem | undefined

			const result = super.delete(index)

			if (item) {
				this._onItemRemovedHook(item)
			}

			return result
		}

		/**
		 * Очищает коллекцию и сбрасывает выбор.
		 */
		clear(): void {
			super.clear()
			this._selectedItems.length = 0
		}

		/**
		 * Вставляет элемент по индексу.
		 * @param index - позиция вставки
		 * @returns вставленный элемент
		 */
		insert(index: number): TItem {
			const it = super.insert(index) as TItem

			return it
		}
	}
}
