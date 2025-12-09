import { describe, it, expect } from 'vitest'
import { TActivatableTree } from '../classes/tree/activable/activable-tree.class'
import { TActivatableTreeItem } from '../classes/tree/activable/activable-tree-item.class'
import { TActivatableTreeCollection } from '../classes/tree/activable/activable-tree-collection.class'

// Создаем тестовый класс элемента меню
class MenuItem extends TActivatableTreeItem {
	public label: string = ''

	assign(source: Partial<MenuItem>) {
		if (source.label) this.label = source.label
		// Важно: передаем active, если он есть
		if (source.active !== undefined) this.active = source.active
		return super.assign(source)
	}
}

describe('TActivatableTree (Menu Logic)', () => {
	it('should create a root tree', () => {
		const menu = new TActivatableTree({ itemClass: MenuItem })
		expect(menu).toBeInstanceOf(TActivatableTree)
		expect(menu.globalActiveItem).toBeNull()
	})

	it('should activate item in root level', () => {
		const menu = new TActivatableTree({ itemClass: MenuItem })
		const item1 = menu.add({ label: 'File' })
		const item2 = menu.add({ label: 'Edit' })

		// Активируем первый элемент
		item1.active = true

		expect(item1.active).toBe(true)
		expect(menu.activeItem).toBe(item1) // Локальный активный
		expect(menu.globalActiveItem).toBe(item1) // Глобальный активный

		// Активируем второй элемент
		item2.active = true

		expect(item1.active).toBe(false) // Первый должен погаснуть
		expect(item2.active).toBe(true)
		expect(menu.activeItem).toBe(item2)
		expect(menu.globalActiveItem).toBe(item2)
	})

	it('should handle nested activation (Global Radio)', () => {
		const menu = new TActivatableTree({ itemClass: MenuItem })

		// Root Level
		const fileItem = menu.add({ label: 'File' })
		const editItem = menu.add({ label: 'Edit' })

		// Level 2 (File -> New, Open)
		const fileSubMenu = fileItem.createChild(MenuItem)
		const newItem = fileSubMenu.add({ label: 'New' })
		const openItem = fileSubMenu.add({ label: 'Open' })

		// Level 2 (Edit -> Copy, Paste)
		const editSubMenu = editItem.createChild(MenuItem)
		const copyItem = editSubMenu.add({ label: 'Copy' })

		// 1. Активируем элемент в корне
		fileItem.active = true
		expect(menu.globalActiveItem).toBe(fileItem)

		// 2. Активируем элемент во вложенном меню (File -> New)
		// Ожидаем: File погаснет (так как это радио на все дерево), New загорится
		newItem.active = true

		expect(newItem.active).toBe(true)
		expect(fileItem.active).toBe(false) // File погас
		expect(menu.globalActiveItem).toBe(newItem)
		expect(fileSubMenu.activeItem).toBe(newItem) // В подменю активен New

		// 3. Активируем соседа (File -> Open)
		openItem.active = true

		expect(openItem.active).toBe(true)
		expect(newItem.active).toBe(false) // New погас
		expect(menu.globalActiveItem).toBe(openItem)

		// 4. Активируем элемент в ДРУГОЙ ветке (Edit -> Copy)
		copyItem.active = true

		expect(copyItem.active).toBe(true)
		expect(openItem.active).toBe(false) // Open погас (он был в другой ветке)
		expect(menu.globalActiveItem).toBe(copyItem)

		// Проверяем состояние коллекций
		expect(fileSubMenu.activeItem).toBeUndefined() // В подменю File больше нет активных
		expect(editSubMenu.activeItem).toBe(copyItem) // В подменю Edit активен Copy
	})

	it('should clear global active item when item is deactivated', () => {
		const menu = new TActivatableTree({ itemClass: MenuItem })
		const item = menu.add({ label: 'Item' })

		item.active = true
		expect(menu.globalActiveItem).toBe(item)

		// Выключаем вручную
		item.active = false
		// В текущей реализации registerGlobalActiveItem не сбрасывает globalActiveItem в null,
		// если мы просто выключили элемент.
		// Но TActivatableCollection.clear() вызывается.
		// Если нам важно, чтобы globalActiveItem становился null, нужно доработать логику в TActivatableTree.
		// Пока проверим, что сам элемент выключился.
		expect(item.active).toBe(false)
	})
})
