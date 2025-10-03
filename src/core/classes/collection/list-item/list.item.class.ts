import { TCollectionItem, TCollection, TOwnedCollection } from '..'

export class TListItem extends TCollectionItem {
  text: string = ''
  selected: boolean = false

  assign(source: TListItem) {
    super.assign(source)
    this.text = source.text
    this.selected = source.selected
  }

  toggleSelect() {
    this.selected = !this.selected
    this.changed()
  }
}

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
