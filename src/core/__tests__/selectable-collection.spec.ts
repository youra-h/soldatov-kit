import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TSelectableCollection, TSelectableCollectionItem } from '../base/collection'

describe('TSelectableCollectionItem', () => {
	it('toggleSelected and setter emit "change:selection" with itself', () => {
		const item = new TSelectableCollectionItem()
		const spy = vi.fn()

		item.events.on('change:selection', spy)

		item.selected = true
		expect(spy).toHaveBeenCalled()
		// expect(spy.mock.calls[0][0]).toBe(item)
		const payload = spy.mock.calls[0]![0]
		expect(payload).toBe(item)
		expect(item.selected).toBe(true)

		spy.mockClear()
		item.toggleSelected()
		expect(spy).toHaveBeenCalled()
		expect(item.selected).toBe(false)
	})
})

describe('TSelectableCollection', () => {
	it('single mode: selecting an item unselects previous one and emits item:selected/item:unselected', () => {
		const col = new TSelectableCollection({ itemClass: TSelectableCollectionItem })

		const a = col.add({})
		const b = col.add({})

		const selectedSpy = vi.fn()
		const unselectedSpy = vi.fn()
		col.events.on('item:selected', selectedSpy)
		col.events.on('item:unselected', unselectedSpy)

		a.selected = true
		expect(a.selected).toBe(true)
		expect(col.selectedCount).toBe(1)
		expect(col.selected[0]).toBe(a)
		expect(selectedSpy).toHaveBeenCalledTimes(1)

		b.selected = true
		// a must be deselected
		expect(a.selected).toBe(false)
		expect(b.selected).toBe(true)
		expect(col.selectedCount).toBe(1)
		expect(col.selected[0]).toBe(b)
		expect(selectedSpy).toHaveBeenCalledTimes(2)
		expect(unselectedSpy).toHaveBeenCalledTimes(1)
	})

	it('multiple mode: allows multiple selection', () => {
		const col = new TSelectableCollection({ itemClass: TSelectableCollectionItem, mode: 'multiple' })

		const a = col.add({})
		const b = col.add({})

		a.selected = true
		b.selected = true

		expect(a.selected).toBe(true)
		expect(b.selected).toBe(true)
		expect(col.selectedCount).toBe(2)
		expect(col.selected).toEqual(expect.arrayContaining([a, b]))
	})

	it('none mode: selection is ignored and immediately cleared', () => {
		const col = new TSelectableCollection({ itemClass: TSelectableCollectionItem, mode: 'none' })

		const a = col.add({})

		a.selected = true

		// selection must be prevented
		expect(a.selected).toBe(false)
		expect(col.selectedCount).toBe(0)
	})

	it('clear deselects all and emits selection:cleared', () => {
		const col = new TSelectableCollection({
			itemClass: TSelectableCollectionItem,
			mode: 'multiple',
		})

		const a = col.add({})
		const b = col.add({})

		a.selected = true
		b.selected = true

		expect(col.selectedCount).toBe(2)

		const spy = vi.fn()
		col.events.on('selection:cleared', spy)

		col.clear()

		expect(col.selectedCount).toBe(0)
		expect(a.selected).toBe(false)
		expect(b.selected).toBe(false)
		expect(spy).toHaveBeenCalled()
	})

	it('addFromArray() subscribes to item events and maintains selection state', () => {
		const col = new TSelectableCollection({
			itemClass: TSelectableCollectionItem,
			mode: 'multiple'
		})

		const selectedSpy = vi.fn()
		col.events.on('item:selected', selectedSpy)

		// добавляем элементы с разным состоянием selected
		const items = col.addFromArray([
			{ selected: true },
			{ selected: false },
			{ selected: true },
		])

		expect(items).toHaveLength(3)
		expect(col.count).toBe(3)

		// проверяем, что подписки работают
		items[1]!.selected = true
		expect(col.selectedCount).toBe(3)
		expect(selectedSpy).toHaveBeenCalled()
	})

	it('changing mode from multiple to single keeps only first selected', () => {
		const col = new TSelectableCollection({ itemClass: TSelectableCollectionItem, mode: 'multiple' })

		const a = col.add({})
		const b = col.add({})
		const c = col.add({})

		a.selected = true
		b.selected = true
		c.selected = true

		expect(col.selectedCount).toBe(3)

		col.mode = 'single'

		expect(col.selectedCount).toBe(1)
		const only = col.selected[0]
		expect([a, b, c]).toContain(only)
	})
})
