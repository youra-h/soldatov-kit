import { TBehaviorTreeItem } from './../item/behavior-tree-item.class'
import { TSelectableBehavior } from '../../behavior/selectable.behavior'
import { TCollection } from '../../collection/collection.class'

export class TSelectableTreeItem extends TBehaviorTreeItem<TSelectableBehavior> {
	constructor(collection?: TCollection) {
		super(TSelectableBehavior, collection)
	}

	get selected(): boolean {
		return this.behavior.selected
	}
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
