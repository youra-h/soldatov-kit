import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TSelectableCollection, TSelectableCollectionItem } from '../base/collection'
import type { ISelectableCollectionItemProps } from '../base/collection/selectable'

class TestSelectableItem extends TSelectableCollectionItem {
	private _id: number = 0

	get id(): number {
		return this._id
	}

	set id(value: number) {
		this._id = value
	}

	getProps(): ISelectableCollectionItemProps & { id: number } {
		return { ...super.getProps(), id: this._id }
	}
}

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
		const col = new TSelectableCollection({
			itemClass: TSelectableCollectionItem,
			mode: 'multiple',
		})

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
		const col = new TSelectableCollection({
			itemClass: TSelectableCollectionItem,
			mode: 'none',
		})

		const a = col.add({})

		a.selected = true

		// selection must be prevented
		expect(a.selected).toBe(false)
		expect(col.selectedCount).toBe(0)
	})

	it('clear deselects all and emits', () => {
		const col = new TSelectableCollection({
			itemClass: TSelectableCollectionItem,
			mode: 'multiple',
		})

		const a = col.add({})
		const b = col.add({})

		a.selected = true
		b.selected = true

		expect(col.selectedCount).toBe(2)

		col.reset()

		expect(col.selectedCount).toBe(0)
		expect(a.selected).toBe(false)
		expect(b.selected).toBe(false)
	})

	it('addItems() subscribes to item events and maintains selection state', () => {
		const col = new TSelectableCollection({
			itemClass: TSelectableCollectionItem,
			mode: 'multiple',
		})

		const selectedSpy = vi.fn()
		col.events.on('item:selected', selectedSpy)

		// добавляем элементы с разным состоянием selected
		const items = col.addItems([
			{ _: { selected: true } },
			{ _: { selected: false } },
			{ _: { selected: true } },
		])

		expect(items).toHaveLength(3)
		expect(col.count).toBe(3)

		// проверяем, что подписки работают
		items[1]!.selected = true
		expect(col.selectedCount).toBe(3)
		expect(selectedSpy).toHaveBeenCalled()
	})

	it('changing mode from multiple to single keeps only first selected', () => {
		const col = new TSelectableCollection({
			itemClass: TSelectableCollectionItem,
			mode: 'multiple',
		})

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

	describe('_ (underscore) meta data', () => {
		it('setItems extracts _.selected and applies it to elements', () => {
			const col = new TSelectableCollection({
				itemClass: TSelectableCollectionItem,
				mode: 'multiple',
			})

			col.setItems([
				{ _: { selected: true } } as any,
				{} as any,
				{ _: { selected: true } } as any,
			])

			expect(col.count).toBe(3)
			expect(col.selectedCount).toBe(2)
			expect(col.getItem(0)!.selected).toBe(true)
			expect(col.getItem(1)!.selected).toBe(false)
			expect(col.getItem(2)!.selected).toBe(true)
		})

		it('setItems does not emit item:selected or change:selected during init', () => {
			const col = new TSelectableCollection({
				itemClass: TSelectableCollectionItem,
				mode: 'multiple',
			})

			const selectedSpy = vi.fn()
			const changeSpy = vi.fn()
			col.events.on('item:selected', selectedSpy)
			col.events.on('change:selected', changeSpy)

			col.setItems([{ _: { selected: true } } as any, { _: { selected: true } } as any])

			expect(col.selectedCount).toBe(2)
			expect(selectedSpy).not.toHaveBeenCalled()
			expect(changeSpy).not.toHaveBeenCalled()
		})
	})

	describe('patchItems with trackBy', () => {
		const trackBy = (item: any) => item.id

		it('updates selection state via patchItems', () => {
			const col = new TSelectableCollection({
				itemClass: TestSelectableItem,
				mode: 'multiple',
			})

			const a = col.add({ id: 1 } as any)
			const b = col.add({ id: 2 } as any)

			col.patchItems(
				[
					{ id: 1, _: { selected: true } },
					{ id: 2, _: { selected: false } },
				],
				trackBy,
			)

			expect(col.selectedCount).toBe(1)
			expect(a.selected).toBe(true)
			expect(b.selected).toBe(false)
		})

		it('patchItems emits item:selected and change:selected when selecting existing item', () => {
			const col = new TSelectableCollection({
				itemClass: TestSelectableItem,
				mode: 'multiple',
			})

			const selectedSpy = vi.fn()
			const changeSpy = vi.fn()
			col.events.on('item:selected', selectedSpy)
			col.events.on('change:selected', changeSpy)

			const a = col.add({ id: 1 } as any)

			col.patchItems([{ id: 1, _: { selected: true } }], trackBy)

			expect(a.selected).toBe(true)
			expect(col.selectedCount).toBe(1)
			expect(selectedSpy).toHaveBeenCalledTimes(1)
			expect(changeSpy).toHaveBeenCalledTimes(1)
		})

		it('adds new items with selected state via patchItems', () => {
			const col = new TSelectableCollection({
				itemClass: TestSelectableItem,
				mode: 'multiple',
			})

			col.patchItems(
				[
					{ id: 1, _: { selected: true } },
					{ id: 2, _: { selected: true } },
				],
				trackBy,
			)

			expect(col.count).toBe(2)
			expect(col.selectedCount).toBe(2)
		})

		it('deletes items and updates selected count', () => {
			const col = new TSelectableCollection({
				itemClass: TestSelectableItem,
				mode: 'multiple',
			})

			const a = col.add({ id: 1 } as any)
			const b = col.add({ id: 2 } as any)
			a.selected = true
			b.selected = true

			col.patchItems([{ id: 1, _: { selected: true } }], trackBy)

			expect(col.count).toBe(1)
			expect(col.selectedCount).toBe(1)
		})

		it('patchItems from change:selected handler does not cause infinite recursion', () => {
			const col = new TSelectableCollection({
				itemClass: TestSelectableItem,
				mode: 'multiple',
			})

			// Добавляем 3 элемента через setItems
			col.setItems([
				{ id: 1, text: 'A' } as any,
				{ id: 2, text: 'B' } as any,
				{ id: 3, text: 'C' } as any,
			])

			expect(col.count).toBe(3)

			// Счётчик вызовов change:selected
			let selectedCalls = 0

			col.events.on('change:selected', () => {
				selectedCalls++

				// Имитация UI: получаем items и через patchItems выделяем первый
				col.patchItems(
					[
						{ id: 1, text: 'A', _: { selected: true } },
						{ id: 2, text: 'B' },
						{ id: 3, text: 'C' },
					],
					(item: any) => item.id,
				)
			})

			// Выделяем первый элемент — триггерит change:selected
			col.getItem(0)!.selected = true

			// После первой итерации элемент уже selected,
			// повторный patchItems с _: { selected: true } — noop,
			// поэтому change:selected не должен вызываться рекурсивно
			expect(col.selectedCount).toBe(1)
			expect(col.getItem(0)!.selected).toBe(true)
			expect(selectedCalls).toBe(1)
		})

		it('setItems from change:selected handler causes infinite recursion', () => {
			const col = new TSelectableCollection({
				itemClass: TestSelectableItem,
				mode: 'multiple',
			})

			col.setItems([
				{ id: 1, text: 'A' } as any,
				{ id: 2, text: 'B' } as any,
				{ id: 3, text: 'C' } as any,
			])

			expect(col.count).toBe(3)

			let selectedCalls = 0
			let guard = false

			col.events.on('change:selected', () => {
				selectedCalls++

				// setItems полностью пересоздаёт коллекцию с выделенным первым элементом
				// Это вызывает рекурсию, поэтому после первого вызова не вызываем повторно
				if (!guard) {
					guard = true
					col.setItems([
						{ id: 1, text: 'A', _: { selected: true } },
						{ id: 2, text: 'B' },
						{ id: 3, text: 'C' },
					])
				}
			})

			// Выделяем первый элемент — триггерит change:selected
			col.getItem(0)!.selected = true

			// В отличие от patchItems, setItems каждый раз создаёт новые элементы,
			// поэтому change:selected вызывается рекурсивно (selectedCalls > 1)
			expect(col.selectedCount).toBe(1)
			expect(col.getItem(0)!.selected).toBe(true)
			expect(selectedCalls).toBeGreaterThan(1)
		})
	})
})
