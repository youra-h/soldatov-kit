import { describe, it, expect, vi } from 'vitest'
import { TCollectionItem } from '../classes/collection/collection-item.class'
import { TCollection } from '../classes/collection/collection.class'
import { TCollectionOwned } from '../classes/collection/collection-owned.class'

describe('TCollectionItem', () => {
	it('создается без коллекции и с коллекцией', () => {
		const item1 = new TCollectionItem()
		expect(item1.collection).toBeNull()
		const col = new TCollection(TCollectionItem)
		const item2 = new TCollectionItem(col)
		expect(item2.collection).toBe(col)
	})

	it('index геттер/сеттер работает и делегирует коллекции', () => {
		const col = new TCollection(TCollectionItem)
		const item = new TCollectionItem(col)
		const spy = vi.spyOn(col, 'setItemIndex')
		item.index = 2
		expect(spy).toHaveBeenCalledWith(item, 2)
		spy.mockRestore()
		const item2 = new TCollectionItem()
		item2.index = 5
		expect(item2.index).toBe(5)
	})

	it('assign копирует id', () => {
		const a = new TCollectionItem()
		const b = new TCollectionItem()
		a.id = 123
		b.assign(a)
		expect(b.id).toBe(123)
	})

	it('changed вызывает itemChanged у коллекции', () => {
		const col = new TCollection(TCollectionItem)
		const item = new TCollectionItem(col)
		const spy = vi.spyOn(col, 'itemChanged')
		item.changed()
		expect(spy).toHaveBeenCalledWith(item)
	})

	it('free отсоединяет от коллекции', () => {
		const col = new TCollection(TCollectionItem)
		const item = new TCollectionItem(col)
		item.free()
		expect(item.collection).toBeNull()
	})
})

describe('TCollection', () => {
	it('add/insert/insertAt добавляют элементы', () => {
		const col = new TCollection(TCollectionItem)
		const item1 = col.add({ id: 'item1' })
		expect(col.count).toBe(1)
		expect(item1.id).toBe('item1')

		const item2 = col.insert(0)
		expect(col.count).toBe(2)

		// insertAt
		const item3 = new TCollectionItem()
		const ok = col.insertAt(item3, 1)
		expect(ok).toBe(true)
		expect(col.count).toBe(3)
		expect(col.getItem(1)).toBe(item3)
		// insertAt out of bounds
		const item4 = new TCollectionItem()
		const ok2 = col.insertAt(item4, 10)
		expect(ok2).toBe(false)
		expect(col.count).toBe(3)
		// insertAt без указания индекса
		const item5 = new TCollectionItem()
		const ok3 = col.insertAt(item5)
		expect(ok3).toBe(true)
		expect(col.count).toBe(4)
		expect(col.getItem(3)).toBe(item5)
	})

	it('delete удаляет элемент по индексу', () => {
		const col = new TCollection(TCollectionItem)
		col.add()
		expect(col.count).toBe(1)
		const ok = col.delete(0)
		expect(ok).toBe(true)
		expect(col.count).toBe(0)
	})

	it('clear очищает коллекцию', () => {
		const col = new TCollection(TCollectionItem)
		col.add()
		col.add()
		col.clear()
		expect(col.count).toBe(0)
	})

	it('setItemIndex/move/moveItem перемещают элементы', () => {
		const col = new TCollection(TCollectionItem)
		const a = col.add()
		const b = col.add()
		col.setItemIndex(a, 1)
		expect(col.getItem(1)).toBe(a)
		col.move(1, 0)
		expect(col.getItem(0)).toBe(a)
		col.moveItem(a, 1)
		expect(col.getItem(1)).toBe(a)
	})

	it('beginUpdate/endUpdate откладывают notifyChange (changed), но не другие события', () => {
		const col = new TCollection(TCollectionItem)
		const changed = vi.fn()
		const added = vi.fn()
		col.on('changed', changed)
		col.on('added', added)

		col.beginUpdate()
		const item1 = col.add()
		const item2 = col.add()

		// Событие changed не должно быть вызвано до endUpdate
		expect(changed).not.toHaveBeenCalled()
		// Но событие added вызывается сразу для каждого add
		expect(added).toHaveBeenCalledTimes(2)
		expect(added).toHaveBeenNthCalledWith(1, { collection: col, item: item1 })
		expect(added).toHaveBeenNthCalledWith(2, { collection: col, item: item2 })

		col.endUpdate()

		// После endUpdate должно быть вызвано changed с последним элементом (или с undefined, если notifyChange(undefined))
		expect(changed).toHaveBeenCalledTimes(1)
		expect(changed).toHaveBeenCalledWith({ collection: col, item: undefined })
	})

	it('forEach и toArray работают', () => {
		const col = new TCollection(TCollectionItem)
		col.add()
		col.add()
		let count = 0
		col.forEach(() => count++)
		expect(count).toBe(2)
		expect(col.toArray().length).toBe(2)
	})
})

describe('TCollectionOwned', () => {
	it('getOwner возвращает владельца', () => {
		const owner = { name: 'test' }
		const col = new TCollectionOwned(owner, TCollectionItem)
		expect(col.getOwner()).toBe(owner)
	})
})

describe('TCollection events', () => {
	it('emits "added" and "changed" on add', () => {
		const col = new TCollection(TCollectionItem)
		const added = vi.fn()
		const changed = vi.fn()
		col.on('added', added)
		col.on('changed', changed)
		const item = col.add()
		expect(added).toHaveBeenCalledWith({ collection: col, item })
		expect(changed).toHaveBeenCalledWith({ collection: col, item })
	})

	it('emits beforeDelete/afterDelete/changed on delete', () => {
		const col = new TCollection(TCollectionItem)
		const item = col.add()
		const beforeDelete = vi.fn(() => true)
		const afterDelete = vi.fn()
		const changed = vi.fn()
		col.on('beforeDelete', beforeDelete)
		col.on('afterDelete', afterDelete)
		col.on('changed', changed)
		const ok = col.delete(0)
		expect(ok).toBe(true)
		expect(beforeDelete).toHaveBeenCalledWith({ collection: col, index: 0, item })
		expect(afterDelete).toHaveBeenCalledWith({ collection: col, index: 0, item })
		expect(changed).toHaveBeenCalledWith({ collection: col, item })
	})

	it('can cancel delete via beforeDelete', () => {
		const col = new TCollection(TCollectionItem)
		col.add()
		col.on('beforeDelete', () => false)
		const ok = col.delete(0)
		expect(ok).toBe(false)
	})

	it('emits cleared and changed on clear', () => {
		const col = new TCollection(TCollectionItem)
		col.add()
		const cleared = vi.fn()
		const changed = vi.fn()
		col.on('cleared', cleared)
		col.on('changed', changed)
		col.clear()
		expect(cleared).toHaveBeenCalledWith({ collection: col })
		expect(changed).toHaveBeenCalledWith({ collection: col, item: undefined })
	})

	it('emits beforeMove/afterMove/changed on move', () => {
		const col = new TCollection(TCollectionItem)
		const a = col.add()
		const b = col.add()
		const beforeMove = vi.fn(() => true)
		const afterMove = vi.fn()
		const changed = vi.fn()
		col.on('beforeMove', beforeMove)
		col.on('afterMove', afterMove)
		col.on('changed', changed)
		col.move(0, 1)
		expect(beforeMove).toHaveBeenCalledWith({ collection: col, oldIndex: 0, newIndex: 1 })
		expect(afterMove).toHaveBeenCalledWith({
			collection: col,
			item: a,
			oldIndex: 0,
			newIndex: 1,
		})
		expect(changed).toHaveBeenCalledWith({ collection: col, item: a })
	})

	it('can cancel move via beforeMove', () => {
		const col = new TCollection(TCollectionItem)
		col.add()
		col.add()
		col.on('beforeMove', () => false)
		col.move(0, 1)
		// порядок не изменился
		expect(col.getItem(0)?.index).toBe(0)
		expect(col.getItem(1)?.index).toBe(1)
	})
})
