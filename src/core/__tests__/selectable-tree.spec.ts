import { describe, it, expect } from 'vitest'
import { TSelectableTree, TSelectableTreeItem } from '../components/tree'

describe('TSelectableTree', () => {
	it('should create instance', () => {
		const tree = new TSelectableTree()
		expect(tree).toBeInstanceOf(TSelectableTree)
		expect(tree.count).toBe(0)
		expect(Array.isArray(tree.selectedItems)).toBe(true)
		expect(tree.selectedCount).toBe(0)
	})

	it('should add items', () => {
		const tree = new TSelectableTree()
		const item = tree.add()

		expect(item).toBeInstanceOf(TSelectableTreeItem)
		expect(tree.count).toBe(1)
		expect(item.collection).toBe(tree)
	})

	it('should collect multiple selection (default multiple)', () => {
		const tree = new TSelectableTree()
		const a = tree.add()
		const b = tree.add()

		a.selected = true
		b.selected = true

		expect(tree.selectedCount).toBe(2)
		expect(tree.selectedItems).toContain(a)
		expect(tree.selectedItems).toContain(b)
	})

	it('should enforce single selection across whole tree', () => {
		const tree = new TSelectableTree({ mode: 'single' })
		const a = tree.add()
		const b = tree.add()

		a.selected = true
		expect(tree.selectedItems).toEqual([a])

		b.selected = true
		expect(a.selected).toBe(false)
		expect(b.selected).toBe(true)
		expect(tree.selectedItems).toEqual([b])
	})

	it('should handle nested selection', () => {
		const tree = new TSelectableTree({ mode: 'multiple' })
		const root = tree.add()
		const childBranch = root.createChild()
		const child = childBranch.add()

		child.selected = true
		expect(tree.selectedItems).toContain(child)
		expect(tree.selectedCount).toBe(1)
	})

	it('should block selection in none mode', () => {
		const tree = new TSelectableTree({ mode: 'none' })
		const a = tree.add()

		a.selected = true
		expect(a.selected).toBe(false)
		expect(tree.selectedCount).toBe(0)
	})

	it('should clear selection', () => {
		const tree = new TSelectableTree({ mode: 'multiple' })
		const a = tree.add()
		const b = tree.add()

		a.selected = true
		b.selected = true
		expect(tree.selectedCount).toBe(2)

		tree.clearSelection()
		expect(tree.selectedCount).toBe(0)
		expect(a.selected).toBe(false)
		expect(b.selected).toBe(false)
	})
})
