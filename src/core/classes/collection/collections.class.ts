import { TEvented } from '../evented'
import type { TCollectionEvents } from './types'
import { TCollectionItem } from './collection-item.class'
import type { TConstructor } from '../../common/types'

export class TCollection extends TEvented<TCollectionEvents> {
	protected _items: TCollectionItem[] = []
	protected _itemClass: TConstructor<TCollectionItem>
	protected _updateCount = 0
	protected _nextId = 1

	owner: any = null

	constructor(itemClass: TConstructor<TCollectionItem>) {
		super()

		this._itemClass = itemClass
	}

	get count(): number {
		return this._items.length
	}

	add(): TCollectionItem {
		const item = new this._itemClass(this)
		item.id = item.id ?? this._nextId++

		this._items.push(item)
		item._updateIndex(this._items.length - 1)

		this.reindex()
		this.notifyChange(item)

		return item
	}

	insert(index: number): TCollectionItem {
		const item = new this._itemClass(this)
		item.id = this._nextId++
		const i = Math.max(0, Math.min(index, this._items.length))
		this._items.splice(i, 0, item)
		this.reindex()
		this.notifyChange(item)
		return item
	}

	delete(index: number): void {
		if (index < 0 || index >= this._items.length) return
		const removed = this._items.splice(index, 1)[0]
		removed.collection = null
		this.reindex()
		this.notifyChange(removed)
	}

	clear(): void {
		this._items.forEach((it) => (it.collection = null))
		this._items = []
		this.reindex()
		this.notifyChange(undefined)
	}

	getItem(index: number): TCollectionItem | undefined {
		return this._items[index]
	}

	setItemIndex(item: TCollectionItem, newIndex: number): void {
		const old = this._items.indexOf(item)
		if (old === -1) return
		const ni = Math.max(0, Math.min(newIndex, this._items.length - 1))
		if (old === ni) return
		this._items.splice(old, 1)
		this._items.splice(ni, 0, item)
		this.reindex()
		this.notifyChange(item)
	}

	move(fromIndex: number, toIndex: number): void {
		if (fromIndex === toIndex) return
		const item = this._items.splice(fromIndex, 1)[0]
		if (!item) return
		const ti = Math.max(0, Math.min(toIndex, this._items.length))
		this._items.splice(ti, 0, item)
		this.reindex()
		this.notifyChange(item)
	}

	beginUpdate(): void {
		this._updateCount++
	}

	endUpdate(): void {
		if (this._updateCount > 0) this._updateCount--
		if (this._updateCount === 0) this.notifyChange(undefined)
	}

	protected reindex(): void {
		for (let i = 0; i < this._items.length; i++) {
			;(this._items[i] as any)._updateIndex(i)
		}
	}

	protected notifyChange(item?: TCollectionItem): void {
		if (this._updateCount > 0) return

		this.emit('changed', this, item)
	}

	itemChanged(item: TCollectionItem): void {
		this.notifyChange(item)
	}

	forEach(fn: (item: TCollectionItem, idx: number) => void): void {
		this._items.forEach(fn)
	}

	toArray<T extends TCollectionItem>(): T[] {
		return this._items as T[]
	}
}
