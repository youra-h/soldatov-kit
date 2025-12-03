import { TSelectableCollectionItem } from '../../selectable/selectable-collection-item.class'
import type { ITreeItem, ITreeItemProps } from '../types'
import { TSelectableTreeCollection } from './selectable-tree-collection.class'
import type { TSelectableItemEvents } from '../../selectable/types'
import type { TCollection } from '../../collection.class'

export class TSelectableTreeItem
    extends TSelectableCollectionItem<ITreeItemProps, TSelectableItemEvents<TSelectableTreeItem>>
    implements ITreeItem
{
    public readonly children: TSelectableTreeCollection

    constructor(collection: TCollection) {
        super(collection)

        // Создаем дочернюю коллекцию.
        // Передаем owner = this, чтобы коллекция знала своего родителя.
        this.children = new TSelectableTreeCollection({
            itemClass: TSelectableTreeItem,
            owner: this,
            // Наследуем режим выбора от родительской коллекции, если нужно, 
            // но обычно это настраивается отдельно. Пока оставим дефолт.
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