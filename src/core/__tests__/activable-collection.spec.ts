import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TActivatableCollection, TActivatableCollectionItem } from '../base/collection'

describe('TActivatableCollectionItem', () => {
	it('setter and toggleActive emit "change" with itself', () => {
		const item = new TActivatableCollectionItem()
		const spy = vi.fn()

		item.events.on('change', spy)

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
	it('setActive sets active item and emits change; previous item is deactivated', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		const a = col.add({})
		const b = col.add({})

		const spy = vi.fn()
		col.events.on('change', spy)

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

	it('clear clears active and emits change with undefined item', () => {
		const col = new TActivatableCollection({ itemClass: TActivatableCollectionItem })

		const a = col.add({})
		col.setActive(a)

		const spy = vi.fn()
		col.events.on('change', spy)

		col.clear()

		expect(col.activeItem).toBeUndefined()
		expect(a.active).toBe(false)
		expect(spy).toHaveBeenCalled()
		const payload = spy.mock.calls[0]![0]
		expect(payload.collection).toBe(col)
		expect(payload.item).toBeUndefined()
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
})
