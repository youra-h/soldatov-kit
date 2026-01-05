import { describe, it, expect } from 'vitest'
import { TActivatableTree } from '../classes/tree/activable/activable-tree.class'
import { TActivatableTreeItem } from '../classes/tree/activable/activable-tree-item.class'

describe('TActivatableTree', () => {
	it('should create instance', () => {
		const tree = new TActivatableTree()
		expect(tree).toBeInstanceOf(TActivatableTree)
		expect(tree.count).toBe(0)
	})

	it('should add items', () => {
		const tree = new TActivatableTree()
		const item = tree.add()

		expect(item).toBeInstanceOf(TActivatableTreeItem)
		expect(tree.count).toBe(1)
		expect(item.collection).toBe(tree)
	})

	it('should activate item', () => {
		const tree = new TActivatableTree()
		const item = tree.add()

		expect(tree.activeItem).toBeNull()
		expect(item.active).toBe(false)

		item.active = true

		expect(item.active).toBe(true)
		expect(tree.activeItem).toBe(item)
	})

	it('should switch active item (single selection)', () => {
		const tree = new TActivatableTree()
		const item1 = tree.add()
		const item2 = tree.add()

		item1.active = true
		expect(tree.activeItem).toBe(item1)
		expect(item1.active).toBe(true)
		expect(item2.active).toBe(false)

		// Активируем второй, первый должен выключиться
		item2.active = true
		expect(tree.activeItem).toBe(item2)
		expect(item2.active).toBe(true)
		expect(item1.active).toBe(false)
	})

	it('should handle nested items activation', () => {
		const tree = new TActivatableTree()
		const rootItem = tree.add()

		// Создаем дочернюю коллекцию
		const childCollection = rootItem.createChild()
		const childItem = childCollection.add()

		// Активируем корневой элемент
		rootItem.active = true
		expect(tree.activeItem).toBe(rootItem)

		// Активируем вложенный элемент -> корневой должен деактивироваться
		childItem.active = true
		expect(tree.activeItem).toBe(childItem)
		expect(rootItem.active).toBe(false)
		expect(childItem.active).toBe(true)
	})

	it('should allow deactivation', () => {
		const tree = new TActivatableTree()
		const item = tree.add()

		item.active = true
		expect(tree.activeItem).toBe(item)

		item.active = false
		expect(tree.activeItem).toBeNull()
		expect(item.active).toBe(false)
	})
})
