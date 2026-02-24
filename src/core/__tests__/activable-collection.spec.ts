import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TActivatableCollection, TActivatableCollectionItem } from '../base/collection'

describe('TActivatableCollectionItem', () => {
	it('setter and toggleActive emit "change:activation" with itself', () => {
		const item = new TActivatableCollectionItem()
		const spy = vi.fn()

		item.events.on('change:activation', spy)

		item.active = true
		expect(spy).toHaveBeenCalled()
		// expect(spy.mock.calls[0][0]).toBe(item)
		const payload = spy.mock.calls[0]![0]
		expect(payload).toBe(item)
		expect(item.active).toBe(true)

		spy.mockClear()
		item.toggleActive()
		expect(spy).toHaveBeenCalled()
		expect(item.active).toBe(false)
	})
})

describe('TActivatableCollection', () => {
	it('setActive sets active item and emits item:activated; previous item is deactivated', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		const a = col.add({})
		const b = col.add({})

		const spy = vi.fn()
		col.events.on('item:activated', spy)

		col.setActive(a)
		expect(col.activeItem).toBe(a)
		expect(a.active).toBe(true)
		expect(spy).toHaveBeenCalled()

		col.setActive(b)
		// a must be deactivated
		expect(a.active).toBe(false)
		expect(b.active).toBe(true)
		expect(col.activeItem).toBe(b)
	})

	it('clear clears active and emits item:deactivated', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		const a = col.add({})
		col.setActive(a)

		const spy = vi.fn()
		col.events.on('item:deactivated', spy)

		col.clear()

		expect(col.activeItem).toBeUndefined()
		expect(a.active).toBe(false)
		expect(spy).toHaveBeenCalled()
		const payload = spy.mock.calls[0]![0]
		expect(payload.collection).toBe(col)
	})

	it('adding item subscribes to item change and respects item.active toggles', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		const a = col.add({})
		const b = col.add({})

		// when item becomes active via its setter, collection should update
		a.active = true
		expect(col.activeItem).toBe(a)

		// when item deactivates (and was active), collection should clear active
		a.active = false
		expect(col.activeItem).toBeUndefined()
	})

	it('addFromArray() subscribes to item events and maintains active state', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		const activeSpy = vi.fn()
		col.events.on('item:activated', activeSpy)

		// добавляем элементы, один с active: true
		const items = col.addFromArray([
			{ active: false },
			{ active: true },
			{ active: false },
		])

		expect(items).toHaveLength(3)
		expect(col.count).toBe(3)
		expect(col.activeItem).toBe(items[1])

		// проверяем, что подписки работают
		items[2]!.active = true
		expect(col.activeItem).toBe(items[2])
		// предыдущий активный элемент должен быть деактивирован
		expect(items[1]!.active).toBe(false)
		expect(activeSpy).toHaveBeenCalled()
	})

	it('addFromArray() with multiple active: true keeps last one active', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		// добавляем элементы, несколько с active: true
		const items = col.addFromArray([
			{ active: true },
			{ active: false },
			{ active: true },
			{ active: true },
			{ active: false },
		])

		expect(items).toHaveLength(5)
		expect(col.count).toBe(5)

		// только последний элемент с active: true должен остаться активным
		expect(col.activeItem).toBe(items[3])
		expect(items[3]!.active).toBe(true)

		// все остальные должны быть неактивными
		expect(items[0]!.active).toBe(false)
		expect(items[1]!.active).toBe(false)
		expect(items[2]!.active).toBe(false)
		expect(items[4]!.active).toBe(false)
	})

	it('delete activates next item when deleting active item (has next)', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		const a = col.add({})
		const b = col.add({})
		const c = col.add({})

		col.setActive(a)

		// Delete active item (first) - should activate next item (b)
		const result = col.delete(0)

		expect(result).toBe(true)
		expect(col.activeItem).toBe(b)
		expect(b.active).toBe(true)
		expect(col.count).toBe(2)
	})

	it('delete activates previous item when deleting active last item', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		const a = col.add({})
		const b = col.add({})
		const c = col.add({})

		col.setActive(c)

		// Delete active item (last) - should activate previous item (b)
		const result = col.delete(2)

		expect(result).toBe(true)
		expect(col.activeItem).toBe(b)
		expect(b.active).toBe(true)
		expect(col.count).toBe(2)
	})

	it('delete activates next when deleting active middle item', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		const a = col.add({})
		const b = col.add({})
		const c = col.add({})

		col.setActive(b)

		// Delete active item (middle) - should activate next item (c)
		const result = col.delete(1)

		expect(result).toBe(true)
		expect(col.activeItem).toBe(c)
		expect(c.active).toBe(true)
		expect(col.count).toBe(2)
	})

	it('delete does not change active item when deleting non-active item', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		const a = col.add({})
		const b = col.add({})
		const c = col.add({})

		col.setActive(b)

		// Delete non-active item
		const result = col.delete(2)

		expect(result).toBe(true)
		expect(col.activeItem).toBe(b)
		expect(b.active).toBe(true)
		expect(col.count).toBe(2)
	})

	it('delete clears active when deleting the only active item', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		const a = col.add({})
		col.setActive(a)

		// Delete the only item
		const result = col.delete(0)

		expect(result).toBe(true)
		expect(col.activeItem).toBeUndefined()
		expect(col.count).toBe(0)
	})

	it('deleteItem works correctly and activates next item', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		const a = col.add({})
		const b = col.add({})
		const c = col.add({})

		col.setActive(a)

		// Delete active item using deleteItem
		const result = col.deleteItem(a)

		expect(result).toBe(true)
		expect(col.activeItem).toBe(b)
		expect(b.active).toBe(true)
		expect(col.count).toBe(2)
	})

	it('deleteItem returns false when item is not in collection', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })
		const a = col.add({})

		const outsideItem = new TActivatableCollectionItem()

		const result = col.deleteItem(outsideItem)

		expect(result).toBe(false)
		expect(col.count).toBe(1)
	})
})
