import type { TConstructor } from '../../../common/types'
import type { TCollectionOwned } from '../collection-owned.class'
import type { TCollectionItem } from '../collection-item.class'
import type { ISelectableCollection, TIndexOrItem } from './types'

/**
 * Mixin, который добавляет в коллекцию поведение выбора элементов.
 * Base должен быть классом коллекции, реализующим базовые методы:
 *  - add()/insert()/delete()/clear()/getItem(index)/count/forEach()
 */
export function SelectableCollectionMixin<
	TBase extends TConstructor<TCollectionOwned>,
	TItem extends TCollectionItem = TCollectionItem,
>(Base: TBase) {
	return class SelectableCollection
		extends (Base as any)
		implements ISelectableCollection<TItem>
	{
		protected _multiSelect: boolean
		protected _selectedItems: TItem[] = []

		constructor(...args: any[]) {
			// args: (owner?, itemClass?) — передаём дальше
			super(...args)
			const opts = (args && args[2]) || {}
			this._multiSelect = !!opts.multi
		}

		get selectedItems(): TItem[] {
			return this._selectedItems
		}

		getSelected(): TItem[] {
			return this._selectedItems
		}

		protected _normalize(itemOrIndex: TIndexOrItem<TItem>): TItem | undefined {
			if (typeof itemOrIndex === 'number') {
				return (this as any).getItem(itemOrIndex) as TItem | undefined
			}

			return itemOrIndex as TItem | undefined
		}

		isSelected(itemOrIndex: TIndexOrItem<TItem>): boolean {
			const it = this._normalize(itemOrIndex)

			if (!it) return false

			// быстрый поиск по массиву ссылок
			return this._selectedItems.indexOf(it) !== -1
		}

		select(itemOrIndex: TIndexOrItem<TItem>): void {
			const it = this._normalize(itemOrIndex)

			if (!it) return

			if (this.isSelected(it)) {
				return
			}

			if (!this._multiSelect) {
				// снимаем выделение у всех текущих (обычно 0 или 1)
				for (const prev of this._selectedItems.slice()) {
					;(prev as any).selected = false
				}
				this._selectedItems.length = 0
			}

			// выставляем выбранным
			;(it as any).selected = true
			this._selectedItems.push(it)
		}

		deselect(itemOrIndex: TIndexOrItem<TItem>): void {
			const it = this._normalize(itemOrIndex)

			if (!it) return

			const idx = this._selectedItems.indexOf(it)

			if (idx === -1) {
				return
			}

			;(it as any).selected = false
			this._selectedItems.splice(idx, 1)
		}

		toggle(itemOrIndex: TIndexOrItem<TItem>): void {
			const it = this._normalize(itemOrIndex)

			if (!it) return

			if (this.isSelected(it)) {
				this.deselect(it)
			} else {
				this.select(it)
			}
		}

		selectAll(): void {
			if (!this._multiSelect) {
				// в single-select выбираем первый элемент
				const it = (this as any).getItem(0) as TItem | undefined

				if (it) {
					this.select(it)
				}

				return
			}

			// выбираем все элементы
			;(this as any).forEach((item: TItem) => {
				if (!this.isSelected(item)) {
					;(item as any).selected = true
					this._selectedItems.push(item)
				}
			})
		}

		clearSelection(): void {
			for (const it of this._selectedItems.slice()) {
				;(it as any).selected = false
			}

			this._selectedItems.length = 0
		}

		// Рекомендуемые хуки для синхронизации при изменениях коллекции
		protected _onItemRemovedHook(item: TItem): void {
			const idx = this._selectedItems.indexOf(item)

			if (idx !== -1) {
				this._selectedItems.splice(idx, 1)
			}
		}

		// Если у базовой коллекции есть delete/clear/insert, можно переопределить их:
		delete(index: number): void {
			const item = (this as any).getItem(index) as TItem | undefined

			super.delete(index)

			if (item) {
				this._onItemRemovedHook(item)
			}
		}

		clear(): void {
			super.clear()
			this._selectedItems.length = 0
		}

		insert(index: number): TItem {
			const it = super.insert(index) as TItem
			// вставка не меняет выбранные ссылки, но если у вас хранится индекс — нужно корректировать
			return it
		}
	}
}
