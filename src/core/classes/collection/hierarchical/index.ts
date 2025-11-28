import type { ICollectionItem } from '../item/types'
import type { ITreeStrategy } from './types'
import { TSelectableCollection } from '../selectable/selectable-collection.class'
import { TActivatableCollection } from '../activable/activable-collection.class'

/**
 * Стратегия для дерева из ActivatableCollection.
 * Гарантирует один активный элемент на всё дерево.
 */
export class SingleActiveStrategy implements ITreeStrategy {
	private activeItem?: ICollectionItem

	handleChange(collection: TActivatableCollection, payload: any): void {
		if (payload.item) {
			// сбрасываем предыдущий активный
			if (this.activeItem && this.activeItem !== payload.item) {
				this.activeItem.active = false
			}
			this.activeItem = payload.item
		}
	}

	getSelectedItems(): ICollectionItem[] {
		return []
	}

	getActiveItem(): ICollectionItem | undefined {
		return this.activeItem
	}
}

/**
 * Стратегия для дерева из SelectableCollection (multiple).
 * Агрегирует все выбранные элементы.
 */
export class MultipleSelectionStrategy implements ITreeStrategy {
	private selected: Set<ICollectionItem> = new Set()

	handleChange(collection: TSelectableCollection, payload: any): void {
		if (payload.item.selected) {
			this.selected.add(payload.item)
		} else {
			this.selected.delete(payload.item)
		}
	}

	getSelectedItems(): ICollectionItem[] {
		return Array.from(this.selected)
	}

	getActiveItem(): ICollectionItem | undefined {
		return undefined
	}
}

/**
 * Стратегия для дерева из SelectableCollection (single).
 * Позволяет по одному выбору в каждой коллекции.
 */
export class SingleSelectionStrategy implements ITreeStrategy {
	private selected: Set<ICollectionItem> = new Set()

	handleChange(collection: TSelectableCollection, payload: any): void {
		this.selected.clear()

		if (payload.item.selected) {
			this.selected.add(payload.item)
		}
	}

	getSelectedItems(): ICollectionItem[] {
		return Array.from(this.selected)
	}

	getActiveItem(): ICollectionItem | undefined {
		return undefined
	}
}

export class HierarchicalCollectionWithStrategy {
	private _children: any[] = []
	private _strategy: ITreeStrategy

	constructor(strategy: ITreeStrategy) {
		this._strategy = strategy
	}

	add(child: any): void {
		this._children.push(child)

		if (child.events) {
			child.events.on('change', (payload: any) => {
				this._strategy.handleChange(child, payload)
			})
		}
	}

	get selectedItems(): ICollectionItem[] {
		return this._strategy.getSelectedItems()
	}

	get activeItem(): ICollectionItem | undefined {
		return this._strategy.getActiveItem()
	}
}
