import { TActivatableCollectionItem } from '../../activable/activable-collection-item.class'
import type { ITreeItem, ITreeItemProps } from '../types'
import { TActivatableTreeCollection } from './activable-tree-collection.class'
import type { TActivatableItemEvents } from '../../activable/types'
import type { TCollection } from '../../collection.class'

export class TActivatableTreeItem
    extends TActivatableCollectionItem<ITreeItemProps, TActivatableItemEvents<TActivatableTreeItem>>
    implements ITreeItem
{
    public readonly children: TActivatableTreeCollection

    constructor(collection: TCollection) {
        super(collection)

        this.children = new TActivatableTreeCollection({
            itemClass: TActivatableTreeItem,
            owner: this,
        })
    }

    get parent(): ITreeItem | null {
        const col = this.collection as any
        return col && col.owner ? col.owner : null
    }

    getProps(): ITreeItemProps {
        return {
            ...super.getProps(),
            hasChildren: this.children.count > 0,
        }
    }

    free(): void {
        this.children.clear()
        super.free()
    }
}