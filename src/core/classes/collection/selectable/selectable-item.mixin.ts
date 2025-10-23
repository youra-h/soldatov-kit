import { TCollectionItem } from '../collection-item.class'
import type { ISelectable, ISelectableCollection } from './types'
import type { TConstructor, TAbstractConstructor } from '../../../common/types'

/**
 * Mixin, добавляющий поддержку выбранности (ISelectable) к любому Item‑классу.
 */

// 1. Перегрузка для неабстрактного класса
export function SelectableItemMixin<B extends TConstructor<TCollectionItem>>(
	Base: B,
): new (...args: ConstructorParameters<B>) => InstanceType<B> & ISelectable

// 2. Перегрузка для абстрактного класса
export function SelectableItemMixin<B extends TAbstractConstructor<TCollectionItem>>(
	Base: B,
): abstract new (...args: ConstructorParameters<B>) => InstanceType<B> & ISelectable

// 3. Реализация (JS-часть, один вариант для обоих overload’ов)
export function SelectableItemMixin(Base: any) {
	return class TSelectableItem extends Base implements ISelectable {
		protected _selected: boolean = false

		get selected(): boolean {
			return this._selected
		}

		set selected(value: boolean) {
			if (this._selected === value) return

			// если коллекция поддерживает выбор и singleSelect
			const collection = this.collection as unknown as ISelectableCollection<TCollectionItem>

			if (value && collection && !collection.multiSelect) {
				collection.clearSelection()
			}

			this._selected = value

			this.changed()
		}

		assign(source: this): void {
			super.assign(source)

			if (!source) return

			this._selected = !!source.selected
		}
	}
}
