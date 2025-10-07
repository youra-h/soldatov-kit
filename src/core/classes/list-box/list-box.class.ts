// listbox-core.ts
import { TCollection } from './collection'
import { TListItems, TListItem } from './ui-items'
import { TComponent } from './component' // ваш TComponent

export class TListBox extends TComponent<any> {
  items: TListItems

  constructor(options: any = {}) {
    super(options)
    this.items = new TListItems(this)
    this.items.onChange = () => this.emit('itemsChanged')
  }

  add(text: string) {
    return this.items.addItem(text)
  }
}
