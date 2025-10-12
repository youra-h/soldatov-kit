import { TControlCollection } from '../control/control-collection.class'
import { SelectableCollectionMixin } from './selectable-collection.mixin'
import type { AbstractControlItem } from '../control/control-item.class'
import type { TConstructor } from '../../../common/types'
import type { ISelectableCollection } from './types'

export function createSelectableControlCollection<TItem extends AbstractControlItem<any>>() {
	const Mixed = SelectableCollectionMixin(TControlCollection)

	return Mixed as unknown as new (
		owner?: any,
		itemClass?: TConstructor<TItem>,
		opts?: { multi?: boolean },
	) => ISelectableCollection<TItem> & TControlCollection<TItem, any>
}
