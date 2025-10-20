import { describe, it, expect, beforeEach } from 'vitest'
import {
	AbstractControlItem,
	SelectableControlCollection,
	type ISelectable,
} from '../classes/collection'

class TestItem extends AbstractControlItem implements ISelectable {
	private _selected = false

	/**
	 * Флаг выбранности вкладки.
	 * При изменении вызывает changed() для нотификации коллекции/владельца.
	 */
	get selected(): boolean {
		return this._selected
	}

	set selected(value: boolean) {
		if (this._selected === value) return

		this._selected = value

		this.changed()
	}
}

class TestItems extends SelectableControlCollection<TestItem>() {
	constructor() {
		super(undefined, TestItem)
	}
}

describe('SelectableControlCollection', () => {
	let collection: TestItems

	beforeEach(() => {
		collection = new TestItems()
		collection.multiSelect = true
		collection.add({ id: 1 })
		collection.add({ id: 2 })
		collection.add({ id: 3 })
	})

	it('multiSelect работает', () => {
		expect(collection.multiSelect).toBe(true)
		collection.multiSelect = false
		expect(collection.multiSelect).toBe(false)
	})

	it('selectedItems и getSelected возвращают выбранные элементы', () => {
		collection.select(0)
		collection.select(1)
		expect(collection.selectedItems.length).toBe(2)
		expect(collection.getSelected().length).toBe(2)
	})

	it('getSingleSelected возвращает только один элемент в single-select', () => {
		collection.multiSelect = false
		collection.select(0)
		collection.select(1)
		expect(collection.getSingleSelected()).toBe(collection.getItem(1))
	})

	it('isSelected работает для индекса и элемента', () => {
		collection.select(1)
		expect(collection.isSelected(1)).toBe(true)

		const item = collection.getItem(1)!
		expect(collection.isSelected(item)).toBe(true)
		expect(collection.isSelected(0)).toBe(false)
	})

	it('selectById выбирает элемент по id', () => {
		const selected = collection.selectById(2)
		expect(selected).toBeDefined()

		expect(collection.isSelected(0)).toBe(false)
		expect(collection.isSelected(selected!)).toBe(true)
	})

	it('deselect снимает выбор', () => {
		collection.select(0)
		collection.deselect(0)
		expect(collection.isSelected(0)).toBe(false)
	})

	it('toggle переключает выбор', () => {
		collection.toggle(1)
		expect(collection.isSelected(1)).toBe(true)
		collection.toggle(1)
		expect(collection.isSelected(1)).toBe(false)
	})

	it('selectAll выбирает все элементы в multiSelect', () => {
		collection.selectAll()
		expect(collection.selectedItems.length).toBe(collection.count)
	})

	it('clearSelection снимает выбор со всех', () => {
		collection.selectAll()
		collection.clearSelection()
		expect(collection.selectedItems.length).toBe(0)
	})

	it('удаление элемента синхронизирует выбор', () => {
		collection.select(1)
		collection.delete(1)
		expect(collection.selectedItems.length).toBe(0)
	})

	it('clear сбрасывает выбор', () => {
		collection.selectAll()
		collection.clear()
		expect(collection.selectedItems.length).toBe(0)
	})
})
