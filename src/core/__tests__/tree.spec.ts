import { describe, it, expect } from 'vitest'
import { TTree, TTreeItem, TTreeCollection } from '../components/tree'

// 1. Создаем тестовый класс элемента с полем name для удобства
class TestItem extends TTreeItem {
	public name: string = ''

	assign(source: Partial<TestItem>) {
		if (source.name) this.name = source.name
		return super.assign(source)
	}
}

describe('TTree (Tree Structure)', () => {
	it('should create a root tree correctly', () => {
		const tree = new TTree({ itemClass: TestItem })

		expect(tree).toBeInstanceOf(TTree)
		expect(tree.count).toBe(0)
		// У корня root ссылается на самого себя
		expect(tree.root).toBe(tree)
		// У корня нет родительского элемента
		expect(tree.parentItem).toBeNull()
	})

	it('should add items to the root level', () => {
		const tree = new TTree({ itemClass: TestItem })
		const item = tree.add({ name: 'Root Item 1' })

		expect(tree.count).toBe(1)
		expect(item).toBeInstanceOf(TestItem)
		expect(item.name).toBe('Root Item 1')
		// Элемент должен знать свою коллекцию
		expect(item.collection).toBe(tree)
		// Элемент должен иметь доступ к root
		expect(item.root).toBe(tree)
	})

	it('should create a child branch (nested collection)', () => {
		const tree = new TTree({ itemClass: TestItem })
		const rootItem = tree.add({ name: 'Root Item' })

		// Создаем под-коллекцию
		const childBranch = rootItem.createChild(TestItem)

		expect(childBranch).toBeInstanceOf(TTreeCollection)
		// Ветка должна знать своего родителя (элемент)
		expect(childBranch.parentItem).toBe(rootItem)
		// Ветка должна знать глобальный корень
		expect(childBranch.root).toBe(tree)
		// Элемент должен иметь ссылку на ветку
		expect(rootItem.child).toBe(childBranch)
	})

	it('should add items to a child branch', () => {
		const tree = new TTree({ itemClass: TestItem })
		const rootItem = tree.add({ name: 'Root' })
		const childBranch = rootItem.createChild(TestItem)

		const childItem = childBranch.add({ name: 'Child' })

		expect(childBranch.count).toBe(1)
		expect(childItem.collection).toBe(childBranch)
		// Самая важная проверка: доступ к root из глубины
		expect(childItem.root).toBe(tree)
	})

	it('should handle deep nesting (3 levels)', () => {
		const tree = new TTree({ itemClass: TestItem })

		// Level 1
		const itemL1 = tree.add({ name: 'Level 1' })

		// Level 2
		const branchL2 = itemL1.createChild(TestItem)
		const itemL2 = branchL2.add({ name: 'Level 2' })

		// Level 3
		const branchL3 = itemL2.createChild(TestItem)
		const itemL3 = branchL3.add({ name: 'Level 3' })

		// Проверяем цепочку родителей
		expect((itemL3.collection as TTreeCollection).parentItem).toBe(itemL2)
		expect((itemL2.collection as TTreeCollection).parentItem).toBe(itemL1)
		expect((itemL1.collection as TTreeCollection).parentItem).toBeNull() // itemL1 в корне, у корня parentItem нет (или null)

		// Проверяем ссылку на root с самого дна
		expect(itemL3.root).toBe(tree)
	})

	it('should clear child branch when item is removed or freed', () => {
		const tree = new TTree({ itemClass: TestItem })
		const rootItem = tree.add({ name: 'Root' })
		const childBranch = rootItem.createChild(TestItem)
		childBranch.add({ name: 'Child' })

		expect(rootItem.child).not.toBeNull()

		// Удаляем дочернюю ветку вручную
		rootItem.removeChild()
		expect(rootItem.child).toBeNull()
		// Проверяем, что ветка очистилась (опционально, зависит от реализации removeChild)
		expect(childBranch.count).toBe(0)
	})
})

describe('TTree — find / findBy', () => {
	function buildTree() {
		const tree = new TTree({ itemClass: TestItem })

		const itemA = tree.add({ name: 'A' })
		const itemB = tree.add({ name: 'B' })

		const branchA = itemA.createChild(TestItem)
		const itemA1 = branchA.add({ name: 'A1' })
		const itemA2 = branchA.add({ name: 'A2' })

		const branchA1 = itemA1.createChild(TestItem)
		const itemA1a = branchA1.add({ name: 'A1a' })

		return { tree, itemA, itemB, itemA1, itemA2, itemA1a }
	}

	describe('find', () => {
		it('находит элемент на корневом уровне', () => {
			const { tree, itemB } = buildTree()
			const result = tree.find((item) => item.name === 'B')
			expect(result).toBe(itemB)
		})

		it('находит элемент на втором уровне вложенности', () => {
			const { tree, itemA2 } = buildTree()
			const result = tree.find((item) => item.name === 'A2')
			expect(result).toBe(itemA2)
		})

		it('находит элемент на третьем уровне вложенности', () => {
			const { tree, itemA1a } = buildTree()
			const result = tree.find((item) => item.name === 'A1a')
			expect(result).toBe(itemA1a)
		})

		it('возвращает undefined, если элемент не найден', () => {
			const { tree } = buildTree()
			const result = tree.find((item) => item.name === 'nonexistent')
			expect(result).toBeUndefined()
		})

		it('не находит вложенный элемент плоским поиском по первому уровню', () => {
			// Проверяем, что TCollection.find (плоский) не видит вложенные элементы,
			// а TTree.find (рекурсивный) — видит
			const { tree, itemA, itemA1a } = buildTree()

			// Плоский поиск через коллекцию первого уровня — не найдет A1a
			const flatResult = Array.prototype.find.call(
				[itemA, tree.getItem(1)],
				(item: TestItem) => item.name === 'A1a',
			)
			expect(flatResult).toBeUndefined()

			// Рекурсивный поиск через TTree — найдет
			const recursiveResult = tree.find((item) => item.name === 'A1a')
			expect(recursiveResult).toBe(itemA1a)
		})
	})

	describe('findBy', () => {
		it('находит элемент на корневом уровне по ключу', () => {
			const { tree, itemB } = buildTree()
			const result = tree.findBy('name', 'B')
			expect(result).toBe(itemB)
		})

		it('находит элемент на втором уровне вложенности по ключу', () => {
			const { tree, itemA2 } = buildTree()
			const result = tree.findBy('name', 'A2')
			expect(result).toBe(itemA2)
		})

		it('находит элемент на третьем уровне вложенности по ключу', () => {
			const { tree, itemA1a } = buildTree()
			const result = tree.findBy('name', 'A1a')
			expect(result).toBe(itemA1a)
		})

		it('возвращает undefined, если элемент не найден', () => {
			const { tree } = buildTree()
			const result = tree.findBy('name', 'nonexistent')
			expect(result).toBeUndefined()
		})
	})
})
