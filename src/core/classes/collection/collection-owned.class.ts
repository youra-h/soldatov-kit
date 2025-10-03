import { TCollection } from './collections.class'
import type { TConstructor } from '../../common/types'
import { TCollectionItem } from './collection-item.class'

export class TCollectionOwned extends TCollection {
	constructor(owner: any, itemClass: TConstructor<TCollectionItem>) {
		super(itemClass)
		this.owner = owner
	}

	getOwner(): any {
		return this.owner
	}
}
