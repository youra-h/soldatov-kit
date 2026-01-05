import { TBehaviorTreeItem } from './../item/behavior-tree-item.class'
import { TActivatableBehavior } from '../../behavior/activable.behavior'
import { TCollection } from '../../collection/collection.class'

export class TActivatableTreeItem extends TBehaviorTreeItem<TActivatableBehavior> {
	constructor(collection?: TCollection) {
		// Передаем класс поведения и коллекцию в родительский конструктор
		super(TActivatableBehavior, collection)
	}

	// Фасад для удобства (item.active вместо item.behavior.active)
	get active(): boolean {
		return this.behavior.active
	}
	set active(v: boolean) {
		this.behavior.active = v
	}

	assign(source: Partial<TActivatableTreeItem>): void {
		if (source.active !== undefined) {
			this.active = source.active
		}

		super.assign(source)
	}
}
