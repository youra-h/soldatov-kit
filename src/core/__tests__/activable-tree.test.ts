import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TActivatableTreeCollection } from '../classes/collection/tree/activable/activable-tree-collection.class'
import { TActivatableTreeItem } from '../classes/collection/tree/activable/activable-tree-item.class'

describe('TActivatableTreeCollection', () => {
    let tree: TActivatableTreeCollection

    beforeEach(() => {
        tree = new TActivatableTreeCollection({
            itemClass: TActivatableTreeItem,
        })
    })

    it('should activate item at root level', () => {
        const item1 = tree.add()
        const item2 = tree.add()

        tree.setActive(item1)
        expect(item1.active).toBe(true)
        expect(tree.activeItem).toBe(item1)

        tree.setActive(item2)
        expect(item1.active).toBe(false)
        expect(item2.active).toBe(true)
    })

    it('should handle deep activation and clear parent activation', () => {
        // Структура: Root -> Child -> SubChild
        const root = tree.add()
        const child = root.children.add()
        const subChild = child.children.add()

        // 1. Активируем корень
        tree.setActive(root)
        expect(root.active).toBe(true)
        expect(tree.getSelection()[0]).toBe(root)

        // 2. Активируем самый глубокий элемент
        // Важно: мы вызываем setActive на коллекции, которой принадлежит элемент
        child.children.setActive(subChild)

        expect(subChild.active).toBe(true)
        expect(root.active).toBe(false) // Родите должен деактивироваться
        expect(child.active).toBe(false)

        // Проверяем через getSelection от корня
        const selection = tree.getSelection()
        expect(selection).toHaveLength(1)
        expect(selection[0]).toBe(subChild)
    })

    it('should handle activation in sibling branches', () => {
        // Branch A: RootA -> ChildA
        // Branch B: RootB -> ChildB
        const rootA = tree.add()
        const childA = rootA.children.add()

        const rootB = tree.add()
        const childB = rootB.children.add()

        // Активируем ребенка в ветке А
        rootA.children.setActive(childA)
        expect(childA.active).toBe(true)

        // Активируем ребенка в ветке B
        rootB.children.setActive(childB)

        expect(childB.active).toBe(true)
        expect(childA.active).toBe(false) // Ветка А должна очиститься
        expect(rootA.active).toBe(false)
    })

    it('should emit change event when deep item changes', () => {
        const root = tree.add()
        const child = root.children.add()

        const spy = vi.fn()
        tree.events.on('change', spy)

        // Активация в глубине
        root.children.setActive(child)

        expect(spy).toHaveBeenCalled()
        const payload = spy.mock.calls[0][0]
        expect(payload.item).toBe(child)
        // Коллекция в событии будет та, которая сгенерировала событие (дочерняя),
        // либо мы можем проверить, что событие всплыло.
        // В текущей реализации мы пробрасываем событие: this.events.emit('change', { collection: this, item })
        // где 'this' - это корневая коллекция (так как мы подписались на tree.events)
        expect(payload.collection).toBe(tree)
    })
})
