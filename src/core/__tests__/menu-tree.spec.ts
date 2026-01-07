import { describe, it, expect } from 'vitest'
import { TActivatableTree, TActivatableTreeItem } from '../components/tree'
import type { TConstructor } from '../common/types'

export class TMenuItem extends TActivatableTreeItem {
	public label: string = ''
	public icon: string = ''
	public id: string = ''
	// Можно добавить href, disabled и т.д.

	assign(source: Partial<TMenuItem>): void {
		if (source.label) this.label = source.label
		if (source.icon) this.icon = source.icon
		if (source.id) this.id = source.id

		// Важно: вызываем super.assign, чтобы обработать active и другие базовые свойства
		super.assign(source)
	}
}

/**
 * Класс Меню.
 * Наследуется от TActivatableTree, но уже настроен на работу с TMenuItem.
 */
export class TMenu extends TActivatableTree<TMenuItem> {
	constructor(options?: { itemClass?: TConstructor<TMenuItem> }) {
		super({
			// По умолчанию используем TMenuItem, но даем возможность переопределить
			itemClass: options?.itemClass ?? TMenuItem,
		})
	}

	// Здесь можно добавить специфичные методы для меню.
	// Например, поиск по ID или Label.

	/**
	 * Найти пункт меню по ID.
	 */
	findById(id: string): TMenuItem | undefined {
		return this.find((item) => item.id === id)
	}
}

describe('TMenu (Real Implementation)', () => {
	it('should create menu instance', () => {
		const menu = new TMenu()
		expect(menu).toBeInstanceOf(TMenu)
	})

	it('should add items with properties', () => {
		const menu = new TMenu()
		const file = menu.add({ label: 'File', id: 'file' })

		expect(file).toBeInstanceOf(TMenuItem)
		expect(file.label).toBe('File')
		expect(file.id).toBe('file')
	})

	it('should handle activation logic', () => {
		const menu = new TMenu()
		const item1 = menu.add({ label: 'Item 1' })
		const item2 = menu.add({ label: 'Item 2' })

		item1.active = true
		expect(menu.activeItem).toBe(item1)

		item2.active = true
		expect(menu.activeItem).toBe(item2)
		expect(item1.active).toBe(false)
	})

	it('should support nested structure', () => {
		const menu = new TMenu()
		const root = menu.add({ label: 'Root' })

		// createChild автоматически использует TMenuItem, если мы передадим класс,
		// или нам нужно убедиться, что TMenuItem.createChild возвращает правильный тип.
		// Так как TMenuItem наследует TActivatableTreeItem, он использует его createChild.
		const subMenu = root.createChild()
		const subItem = subMenu.add({ label: 'Sub Item' })

		expect(subItem).toBeInstanceOf(TMenuItem)
		expect(subItem.root).toBe(menu)
	})

	it('should find item by id', () => {
		const menu = new TMenu()
		const root = menu.add({ label: 'Root' })
		const subMenu = root.createChild()
		subMenu.add({ label: 'Target', id: 'target-1' })

		const found = menu.findById('target-1')
		expect(found).toBeDefined()
		expect(found?.label).toBe('Target')
	})

	it('should handle activation across multiple levels', () => {
		const menu = new TMenu()

		// Level 1
		const root1 = menu.add({ label: 'Root 1', id: 'r1' })
		const root2 = menu.add({ label: 'Root 2', id: 'r2' })

		// Level 2 (Children of Root 1)
		const subMenu1 = root1.createChild()
		const child1_1 = subMenu1.add({ label: 'Child 1.1', id: 'c1.1' })
		const child1_2 = subMenu1.add({ label: 'Child 1.2', id: 'c1.2' })

		// Level 3 (Children of Child 1.2)
		const subMenu1_2 = child1_2.createChild()
		const grandChild1_2_1 = subMenu1_2.add({ label: 'GrandChild 1.2.1', id: 'gc1.2.1' })

		// 1. Activate Root 1
		root1.active = true
		expect(menu.activeItem).toBe(root1)
		expect(root1.active).toBe(true)

		// 2. Activate Child 1.1 -> Root 1 should deactivate
		child1_1.active = true
		expect(menu.activeItem).toBe(child1_1)
		expect(child1_1.active).toBe(true)
		expect(root1.active).toBe(false)

		// 3. Activate GrandChild -> Child 1.1 should deactivate
		grandChild1_2_1.active = true
		expect(menu.activeItem).toBe(grandChild1_2_1)
		expect(grandChild1_2_1.active).toBe(true)
		expect(child1_1.active).toBe(false)

		// 4. Activate Root 2 -> GrandChild should deactivate
		root2.active = true
		expect(menu.activeItem).toBe(root2)
		expect(root2.active).toBe(true)
		expect(grandChild1_2_1.active).toBe(false)
	})
})
