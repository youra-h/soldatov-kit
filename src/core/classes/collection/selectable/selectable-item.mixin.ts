import { TCollectionItem } from '../collection-item.class'
import type { ISelectable, ISelectableCollection } from './types'
import type { TConstructor } from '../../../common/types'

/**
 * Mixin, добавляющий поддержку выбранности (ISelectable) к любому Item‑классу.
 */
export function SelectableItemMixin<TBase extends TConstructor<TCollectionItem>>(Base: TBase) {
	return class TSelectableItem extends Base implements ISelectable {
		protected _selected = false

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
