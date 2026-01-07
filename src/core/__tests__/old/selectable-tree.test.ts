import { describe, it, expect, beforeEach } from 'vitest'
import { TSelectableTreeCollection } from '../classes/collection/tree/selectable/selectable-tree-collection.class'
import { TSelectableTreeItem } from '../classes/collection/tree/selectable/selectable-tree-item.class'

describe('TSelectableTreeCollection', () => {
    let tree: TSelectableTreeCollection

    beforeEach(() => {
        tree = new TSelectableTreeCollection({
            itemClass: TSelectableTreeItem,
            mode: 'multiple', // По умолчанию
        })
    })

    it('should create a tree structure', () => {
        const root1 = tree.add()
        const root2 = tree.add()
        const child1 = root1.children.add()

        expect(tree.count).toBe(2)
        expect(root1.children.count).toBe(1)
        expect(root1.hasChildren).toBe(true)
        expect(root2.hasChildren).toBe(false)
    })

    it('should collect selection from nested levels (Multiple Mode)', () => {
        tree.mode = 'multiple'

        const root1 = tree.add()
        const child1 = root1.children.add()
        const subChild1 = child1.children.add()
        const root2 = tree.add()

        // Выбираем элементы на разных уровнях
        root1.selected = true
        subChild1.selected = true
        root2.selected = true

        const selection = tree.getSelection()

        expect(selection.length).toBe(3)
        expect(selection).toContain(root1)
        expect(selection).toContain(subChild1)
        expect(selection).toContain(root2)
        expect(child1.selected).toBe(false)
    })

    it('should enforce single selection across the whole tree (Single Mode)', () => {
        tree.mode = 'single'

        const root1 = tree.add()
        const child1 = root1.children.add() // Ребенок первого корня
        const root2 = tree.add()
        const child2 = root2.children.add() // Ребенок второго корня

        // 1. Выбираем корень
        root1.selected = true
        expect(tree.getSelection()).toHaveLength(1)
        expect(tree.getSelection()[0]).toBe(root1)

        // 2. Выбираем ребенка (должен сброситься корень)
        child1.selected = true

        expect(root1.selected).toBe(false)
        expect(child1.selected).toBe(true)
        expect(tree.getSelection()).toHaveLength(1)
        expect(tree.getSelection()[0]).toBe(child1)

        // 3. Выбираем ребенка в ДРУГОЙ ветке (должен сброситься ребенок первой ветки)
        child2.selected = true

        expect(child1.selected).toBe(false)
        expect(child2.selected).toBe(true)
        expect(tree.getSelection()).toHaveLength(1)
        expect(tree.getSelection()[0]).toBe(child2)
    })

    it('should return all items flat list', () => {
        const root = tree.add()
        const child = root.children.add()
        const subChild = child.children.add()

        const all = tree.getAllItems()
        expect(all.length).toBe(3)
        expect(all[0]).toBe(root)
        expect(all[1]).toBe(child)
        expect(all[2]).toBe(subChild)
    })
})
