import { describe, it, expect, vi } from 'vitest'
import { TListBox } from '../components/list-box'

describe('TListBox — patchItems', () => {
	const trackBy = (item: any) => item.value

	it('patchItems with trackBy updates items in list-box', () => {
		const listBox = new TListBox({ mode: 'single', view: 'plain' })

		listBox.collection.addItems([
			{ value: 'moscow', text: 'Москва' },
			{ value: 'spb', text: 'Санкт-Петербург' },
		])

		listBox.collection.patchItems(
			[
				{ value: 'moscow', text: 'Москва (обновлено)' },
				{ value: 'spb', text: 'Санкт-Петербург (обновлено)' },
			],
			trackBy,
		)

		expect(listBox.collection.count).toBe(2)
		expect(listBox.collection.getItem(0)!.text).toBe('Москва (обновлено)')
		expect(listBox.collection.getItem(1)!.text).toBe('Санкт-Петербург (обновлено)')
	})

	it('patchItems adds and deletes in list-box', () => {
		const listBox = new TListBox({ mode: 'multiple' })

		listBox.collection.addItems([
			{ value: 'moscow', text: 'Москва' },
			{ value: 'spb', text: 'Санкт-Петербург' },
		])

		listBox.collection.patchItems(
			[
				{ value: 'spb', text: 'Санкт-Петербург' },
				{ value: 'kazan', text: 'Казань' },
			],
			trackBy,
		)

		expect(listBox.collection.count).toBe(2)
		expect(listBox.collection.getItem(0)!.value).toBe('spb')
		expect(listBox.collection.getItem(1)!.value).toBe('kazan')
	})

	it('patchItems preserves selection after update', () => {
		const listBox = new TListBox({ mode: 'multiple' })

		const items = listBox.collection.addItems([
			{ value: 'moscow', text: 'Москва' },
			{ value: 'spb', text: 'Санкт-Петербург' },
			{ value: 'kazan', text: 'Казань' },
		])

		items[0]!.selected = true
		items[2]!.selected = true

		listBox.collection.patchItems(
			[
				{ value: 'moscow', text: 'Москва (updated)' },
				{ value: 'spb', text: 'Санкт-Петербург' },
				{ value: 'kazan', text: 'Казань (updated)' },
			],
			trackBy,
		)

		expect(listBox.collection.selectedCount).toBe(2)
		expect(items[0]!.selected).toBe(true)
		expect(items[2]!.selected).toBe(true)
		expect(items[0]!.text).toBe('Москва (updated)')
	})

	it('patchItems with 10 items → add 2 → 12 via trackBy', () => {
		const listBox = new TListBox({ mode: 'multiple' })

		const cities = [
			{ value: '1', text: 'Город 1' },
			{ value: '2', text: 'Город 2' },
			{ value: '3', text: 'Город 3' },
			{ value: '4', text: 'Город 4' },
			{ value: '5', text: 'Город 5' },
			{ value: '6', text: 'Город 6' },
			{ value: '7', text: 'Город 7' },
			{ value: '8', text: 'Город 8' },
			{ value: '9', text: 'Город 9' },
			{ value: '10', text: 'Город 10' },
		]

		listBox.collection.addItems(cities)

		listBox.collection.patchItems(
			[
				...cities,
				{ value: '11', text: 'Город 11' },
				{ value: '12', text: 'Город 12' },
			],
			trackBy,
		)

		expect(listBox.collection.count).toBe(12)
		expect(listBox.collection.getItem(10)!.value).toBe('11')
		expect(listBox.collection.getItem(11)!.value).toBe('12')
	})

	it('patchItems without trackBy does nothing in list-box', () => {
		const listBox = new TListBox({ mode: 'single' })

		listBox.collection.addItems([{ value: 'a', text: 'A' }])

		listBox.collection.patchItems([{ value: 'b', text: 'B' }])

		expect(listBox.collection.count).toBe(1)
	})
})
