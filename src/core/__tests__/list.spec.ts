import { describe, it, expect, vi } from 'vitest'
import { TList } from '../components/list'

describe('TList — patchItems', () => {
	const trackBy = (item: any) => item.value

	it('patchItems with trackBy updates existing items', () => {
		const list = new TList({ mode: 'single' })

		list.collection.addItems([
			{ value: 'a', text: 'Item A' },
			{ value: 'b', text: 'Item B' },
		])

		list.collection.patchItems(
			[
				{ value: 'a', text: 'Item A Updated' },
				{ value: 'b', text: 'Item B Updated' },
			],
			trackBy,
		)

		expect(list.collection.count).toBe(2)
		expect(list.collection.getItem(0)!.text).toBe('Item A Updated')
		expect(list.collection.getItem(1)!.text).toBe('Item B Updated')
	})

	it('patchItems adds new items and deletes removed ones', () => {
		const list = new TList({ mode: 'single' })

		list.collection.addItems([
			{ value: 'a', text: 'Item A' },
			{ value: 'b', text: 'Item B' },
		])

		list.collection.patchItems(
			[
				{ value: 'b', text: 'Item B' },
				{ value: 'c', text: 'Item C' },
			],
			trackBy,
		)

		expect(list.collection.count).toBe(2)
		expect(list.collection.getItem(0)!.value).toBe('b')
		expect(list.collection.getItem(1)!.value).toBe('c')
	})

	it('patchItems preserves selection state for existing items', () => {
		const list = new TList({ mode: 'multiple' })

		const [a] = list.collection.addItems([
			{ value: 'a', text: 'Item A' },
			{ value: 'b', text: 'Item B' },
		])

		a!.selected = true

		list.collection.patchItems(
			[
				{ value: 'a', text: 'Item A Updated' },
				{ value: 'b', text: 'Item B' },
			],
			trackBy,
		)

		// selected state сохраняется, потому что assign не трогает selected
		expect(a!.selected).toBe(true)
		expect(a!.text).toBe('Item A Updated')
	})

	it('patchItems without trackBy does nothing', () => {
		const list = new TList({ mode: 'single' })

		list.collection.addItems([{ value: 'a', text: 'Item A' }])

		list.collection.patchItems([{ value: 'b', text: 'Item B' }])

		expect(list.collection.count).toBe(1)
		expect(list.collection.getItem(0)!.value).toBe('a')
	})

	it('patchItems with empty sources clears all', () => {
		const list = new TList({ mode: 'single' })

		list.collection.addItems([
			{ value: 'a', text: 'Item A' },
			{ value: 'b', text: 'Item B' },
		])

		list.collection.patchItems([], trackBy)

		expect(list.collection.count).toBe(0)
	})

	it('patchItems with items = 5 → push 2 → patchItems via trackBy', () => {
		const list = new TList({ mode: 'multiple' })

		// Начальные 5 элементов
		list.collection.addItems([
			{ value: '1', text: 'One' },
			{ value: '2', text: 'Two' },
			{ value: '3', text: 'Three' },
			{ value: '4', text: 'Four' },
			{ value: '5', text: 'Five' },
		])

		// Имитация push: 5 + 2 = 7 элементов
		list.collection.patchItems(
			[
				{ value: '1', text: 'One' },
				{ value: '2', text: 'Two' },
				{ value: '3', text: 'Three' },
				{ value: '4', text: 'Four' },
				{ value: '5', text: 'Five' },
				{ value: '6', text: 'Six' },
				{ value: '7', text: 'Seven' },
			],
			trackBy,
		)

		expect(list.collection.count).toBe(7)
		expect(list.collection.getItem(5)!.value).toBe('6')
		expect(list.collection.getItem(6)!.value).toBe('7')
	})

	it('patchItems with items = 5 → filter → 3 → patchItems via trackBy', () => {
		const list = new TList({ mode: 'multiple' })

		list.collection.addItems([
			{ value: '1', text: 'One' },
			{ value: '2', text: 'Two' },
			{ value: '3', text: 'Three' },
			{ value: '4', text: 'Four' },
			{ value: '5', text: 'Five' },
		])

		// Имитация фильтрации: оставляем только 1, 3, 5
		list.collection.patchItems(
			[
				{ value: '1', text: 'One' },
				{ value: '3', text: 'Three' },
				{ value: '5', text: 'Five' },
			],
			trackBy,
		)

		expect(list.collection.count).toBe(3)
		expect(list.collection.getItem(0)!.value).toBe('1')
		expect(list.collection.getItem(1)!.value).toBe('3')
		expect(list.collection.getItem(2)!.value).toBe('5')
	})
})
