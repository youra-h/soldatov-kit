import { TBehaviorTreeItem } from './../item/behavior-tree-item.class'
import { TActivatableBehavior } from '../../../base/behaviors'
import { TCollection } from '../../../base/collection'

export class TActivatableTreeItem extends TBehaviorTreeItem<TActivatableBehavior> {
	constructor(collection?: TCollection) {
		super(collection)

		this._behavior = new TActivatableBehavior()

		this._behavior.events.on('change:activation', () => this.notifyChange('behaviorChange'))
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
