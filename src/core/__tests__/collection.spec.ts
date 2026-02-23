import { describe, it, expect, vi } from 'vitest'
import { TCollection, TCollectionItem } from '../base/collection'

class TestItem extends TCollectionItem {}

describe('TCollectionItem', () => {
	it('free() emits "free" with itself', () => {
		const item = new TestItem()
		const spy = vi.fn()

		item.events.on('free', spy)

		item.free()

		expect(spy).toHaveBeenCalled()
		// expect(spy.mock.calls[0][0]).toBe(item)
		const payload = spy.mock.calls[0]![0]
		expect(payload).toBe(item)
	})
})

describe('TCollection', () => {
	it('add() creates item, increments count and emits "added"', () => {
        const col = new TCollection({ itemClass: TestItem })
        const spy = vi.fn()

        col.events.on('added', spy)

        const item = col.add({})

        expect(col.count).toBe(1)
        expect(col.getItem(0)).toBe(item)
        expect(spy).toHaveBeenCalled()

        // безопасный доступ — non-null assertion
        const payload = spy.mock.calls[0]![0]
        expect(payload.collection).toBe(col)
        expect(payload.item).toBe(item)
    })

	it('addFromArray() creates multiple items from array and emits "added" for each', () => {
		const col = new TCollection({ itemClass: TestItem })
		const spy = vi.fn()

		col.events.on('added', spy)

		const sources = [{}, {}, {}]
		const items = col.addFromArray(sources)

		expect(items).toHaveLength(3)
		expect(col.count).toBe(3)
		expect(spy).toHaveBeenCalledTimes(3)

		// проверяем, что каждый элемент добавлен в коллекцию
		items.forEach((item, index) => {
			expect(col.getItem(index)).toBe(item)
		})
	})

	it('addFromArray() returns empty array when called with empty array', () => {
		const col = new TCollection({ itemClass: TestItem })
		const spy = vi.fn()

		col.events.on('added', spy)

		const items = col.addFromArray([])

		expect(items).toHaveLength(0)
		expect(col.count).toBe(0)
		expect(spy).not.toHaveBeenCalled()
	})

	it('insert() and insertAt() insert items at positions and respect collection membership', () => {
		const col1 = new TCollection({ itemClass: TestItem })
		const col2 = new TCollection({ itemClass: TestItem })

		const a = col1.add({})
		const b = col1.add({})

		// insert new item at 0
		const ins = col1.insert(0)
		expect(ins).toBeDefined()
		expect(col1.count).toBe(3)

		// attempt to insert item from other collection
		const other = col2.add({})
		const res = col1.insertAt(other, 0)
		expect(res).toBe(false)
	})

	it('delete() removes item and emits before/after events; beforeDelete can cancel', () => {
		const col = new TCollection({ itemClass: TestItem })

		const a = col.add({})
		const b = col.add({})

		// cancel deletion
		col.events.on('beforeDelete', () => false)
		const res1 = col.delete(0)
		expect(res1).toBe(false)
		expect(col.count).toBe(2)

		// remove without cancellation
		// remove the cancelling listener by creating a fresh collection
		const col2 = new TCollection({ itemClass: TestItem })
		const i1 = col2.add({})
		const i2 = col2.add({})
		const afterSpy = vi.fn()
		col2.events.on('afterDelete', afterSpy)

		const res2 = col2.delete(0)
		expect(res2).toBe(true)
		expect(col2.count).toBe(1)
		expect(afterSpy).toHaveBeenCalled()
	})

	it('clear() frees items and emits "cleared"', () => {
		const col = new TCollection({ itemClass: TestItem })

		const i1 = col.add({})
		const i2 = col.add({})

		const spyCleared = vi.fn()
		col.events.on('cleared', spyCleared)

		const spyFree1 = vi.spyOn(i1, 'free')
		const spyFree2 = vi.spyOn(i2, 'free')

		col.clear()

		expect(col.count).toBe(0)
		expect(spyCleared).toHaveBeenCalled()
		expect(spyFree1).toHaveBeenCalled()
		expect(spyFree2).toHaveBeenCalled()
	})

	it('setItemIndex/move emits beforeMove/afterMove and reorders items; beforeMove can cancel', () => {
		const col = new TCollection({ itemClass: TestItem })

		const a = col.add({})
		const b = col.add({})
		const c = col.add({})

		// cancel move
		col.events.on('beforeMove', () => false)
		col.setItemIndex(a, 2)
		// positions unchanged
		expect(col.getItem(0)).toBe(a)
		expect(col.getItem(1)).toBe(b)
		expect(col.getItem(2)).toBe(c)

		// new collection to test successful move
		const col2 = new TCollection({ itemClass: TestItem })
		const x = col2.add({})
		const y = col2.add({})
		const z = col2.add({})

		const afterMoveSpy = vi.fn()
		col2.events.on('afterMove', afterMoveSpy)

		col2.setItemIndex(x, 2)

		expect(col2.getItem(2)).toBe(x)
		expect(afterMoveSpy).toHaveBeenCalled()
		const payload = afterMoveSpy.mock.calls[0]![0]
		expect(payload.collection).toBe(col2)
		expect(payload.item).toBe(x)
	})
})
