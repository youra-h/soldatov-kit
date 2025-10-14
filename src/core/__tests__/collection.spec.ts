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
		const item1 = col.add()
		expect(col.count).toBe(1)
		const item2 = col.insert(0)
		expect(col.count).toBe(2)
		const item3 = new TCollectionItem()
		const ok = col.insertAt(1, item3)
		expect(ok).toBe(true)
		expect(col.count).toBe(3)
		expect(col.getItem(1)).toBe(item3)
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

	it('beginUpdate/endUpdate откладывают notifyChange', () => {
		const col = new TCollection(TCollectionItem)
		const spy = vi.spyOn(col, 'emit')
		col.beginUpdate()
		col.add()
		col.add()
		expect(spy).not.toHaveBeenCalled()
		col.endUpdate()
		expect(spy).toHaveBeenCalledWith('changed', col, undefined)
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
