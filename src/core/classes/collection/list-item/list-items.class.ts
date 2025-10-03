import { TCollectionItem, TCollection, TOwnedCollection } from '..'
import { TListItem } from './list.item.class'

export class TListItems extends TOwnedCollection {
  constructor(owner?: any) {
    super(owner, TListItem)
  }

  addItem(text = ''): TListItem {
    const it = this.add() as TListItem
    it.text = text
    return it
  }
}
