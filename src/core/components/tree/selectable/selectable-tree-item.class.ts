import { TBehaviorTreeItem } from './../item/behavior-tree-item.class'
import { TSelectableBehavior } from '../../behavior/selectable.behavior'
import { TCollection } from '../../collection/collection.class'

/**
 * Элемент дерева с поддержкой выбранности.
 *
 * Технически выбранность реализована через поведение (`TSelectableBehavior`),
 * а этот класс даёт фасадное свойство `selected`.
 */
export class TSelectableTreeItem extends TBehaviorTreeItem<TSelectableBehavior> {
	/**
	 * @param collection Коллекция/ветка дерева, которой принадлежит элемент
	 */
	constructor(collection?: TCollection) {
		super(TSelectableBehavior, collection)
	}

	/** Выбран ли элемент. */
	get selected(): boolean {
		return this.behavior.selected
	}
	/** Установить выбранность элемента. */
	set selected(v: boolean) {
		this.behavior.selected = v
	}

	assign(source: Partial<TSelectableTreeItem>): void {
		if (source.selected !== undefined) {
			this.selected = source.selected
		}

		super.assign(source)
	}
}
