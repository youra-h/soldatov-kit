// src/core/__tests__/tab-items.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { Tabs, TTabItem } from '../classes/tabs' // путь подкорректируй под свой проект
import { createSelectableControlCollection } from '../classes/collection' // путь подкорректируй под свой проект

describe('Tabs (Tabs / TTabItem)', () => {
	let tabs: Tabs

	beforeEach(() => {
		tabs = new Tabs()
	})

	it('добавляет вкладки и возвращает корректные элементы', () => {
		const t1 = tabs.addItem()
		t1.text = 'Главная'
		t1.name = 'main'

		const t2 = tabs.addItem()
		t2.text = 'Профиль'
		t2.name = 'profile'

		const t3 = tabs.addItem()
		t3.text = 'Настройки'
		t3.name = 'settings'

		const arr = tabs.toArray()

		// проверяем, что массив имеет правильную длину
		expect(arr.length).toBe(3)
		// проверяем, что массив содержит добавленные элементы
		expect(arr).toEqual([t1, t2, t3])
		// проверяем свойства элементов
		expect(arr.map((x) => x.text)).toEqual(['Главная', 'Профиль', 'Настройки'])
		// проверяем свойства элементов
		expect(arr.map((x) => x.name)).toEqual(['main', 'profile', 'settings'])
		// проверяем типы элементов
		expect(t1 instanceof TTabItem).toBe(true)
	})

	it('чтение/запись свойств элементов коллекции', () => {
		const [t1, t2, t3] = [tabs.addItem(), tabs.addItem(), tabs.addItem()]
		t1.text = 'A'
		t2.visible = false
		t3.hidden = true
		t1.size = 'sm'

		expect(t1.text).toBe('A')
		expect(t2.visible).toBe(false)
		expect(t3.hidden).toBe(true)
		expect(t1.size).toBe('sm')
	})

	it('Добавление / Вставка / Установка нового индекса / Перенос вкладки на новое место / Удаление', () => {
		// Создание табов
		const t1 = tabs.addItem()
		t1.name = 'a'
		const t2 = tabs.addItem()
		t2.name = 'b'
		const t3 = tabs.addItem()
		t3.name = 'c'

		// Вставка таба по индексу
		const t1_5 = tabs.insertItem(1)
		t1_5.name = 'a.5'
		expect(tabs.toArray().map((x) => x.name)).toEqual(['a', 'a.5', 'b', 'c'])

		// Установка нового индекса таба
		tabs.setItemIndex(t1_5, 2)
		expect(tabs.toArray().map((x) => x.name)).toEqual(['a', 'b', 'a.5', 'c'])

		// Перенос таба на новое место
		tabs.move(0, 2) // перемещаем 'a' на позицию 2
		expect(tabs.toArray().map((x) => x.name)).toEqual(['b', 'a.5', 'a', 'c'])
		// Перенос таба на новое место
		tabs.moveItem(t3, 1) // перемещаем 'c' на позицию 1
		expect(tabs.toArray().map((x) => x.name)).toEqual(['b', 'c', 'a.5', 'a'])

		// Удаление табов
		tabs.delete(1) // удаляем 'Профиль'
		expect(tabs.toArray().length).toBe(3)
		// Удаление табов по имени
		const deleted = tabs.deleteByName('a.5')
		expect(deleted).toBe(true)
		expect(tabs.toArray().length).toBe(2)
		// Попытка удалить несуществующий таб
		const notDeleted = tabs.deleteByName('nonexistent')
		expect(notDeleted).toBe(false)
		expect(tabs.toArray().length).toBe(2) // длина не изменилась

		// Удаление всех табов
		tabs.clear()
		expect(tabs.toArray().length).toBe(0)
	})

	it('single-select: selectByIndex и selectByName работают и обновляют selected', () => {
		const t1 = tabs.addItem()
		t1.name = 'main'
		const t2 = tabs.addItem()
		t2.name = 'profile'
		const t3 = tabs.addItem()
		t3.name = 'settings'

		// По индексу
		tabs.selectByIndex(1)
		expect(Array.isArray(tabs.getSelected())).toBe(false) // getSelected возвращает один элемент в single-mode
		const tabProfile = tabs.getSelected() as TTabItem
		expect(tabProfile.name).toBe('profile')
		expect(t2.selected).toBe(true)
		expect(tabs.selectedItems.length).toBe(1)

		// Снятие выбора
		tabs.clearSelection()
		expect(tabs.getSelected()).toBeUndefined()
		expect(t2.selected).toBe(false)
		expect(tabs.selectedItems.length).toBe(0)

		// По имени
		const found = tabs.selectByName('settings')
		expect(found).toBe(true)
		const tabSettings = tabs.getSelected() as TTabItem
		expect(tabSettings.name).toBe('settings')
		expect(t3.selected).toBe(true)
		expect(tabs.selectedItems.length).toBe(1)
	})

	it('single-select: выбор нового элемента снимает предыдущий', () => {
		const t1 = tabs.addItem()
		t1.name = 'a'
		const t2 = tabs.addItem()
		t2.name = 'b'

		tabs.select(t1)
		expect(t1.selected).toBe(true)
		expect(tabs.selectedItems.length).toBe(1)

		tabs.select(t2)
		expect(t1.selected).toBe(false)
		expect(t2.selected).toBe(true)
		expect(tabs.selectedItems.length).toBe(1)
	})

	it('удаление элемента корректно синхронизирует selection', () => {
		tabs.addItem().name = 'a'
		tabs.addItem().name = 'b'
		tabs.addItem().name = 'c'

		tabs.selectByIndex(1) // выбираем 'b'
		const tab = tabs.getSelected() as TTabItem
		expect(tab.name).toBe('b')

		tabs.delete(1) // удаляем 'b'
		expect(tabs.toArray().length).toBe(2)
		// after removal selection should be cleared or adjusted by implementation; проверим, что нет ссылки на удалённый элемент
		const sel = tabs.selectedItems
		expect(sel.every((s) => tabs.toArray().includes(s))).toBe(true)
	})

	it('multi-select: переключение режима через multiSelect геттер/сеттер', () => {
		// создаём multi-select коллекцию через фабрику
		// const SelectableCtor = createSelectableControlCollection<TTabItem>()
		// const multi = new (SelectableCtor as any)(null, TTabItem, { multi: true }) as any
		// const multi = tabs;

		// добавляем элементы
		tabs.addItem().name = 'a'
		tabs.addItem().name = 'b'
		tabs.addItem().name = 'c'

		// убедимся, что режим multi включён и доступен через геттер
		expect(tabs.multiSelect).toBe(true)

		// выбор нескольких
		tabs.select(0)
		tabs.select(2)
		expect(tabs.selectedItems.map((x: TTabItem) => x.name)).toEqual(['a', 'c'])

		// снять первый
		tabs.deselect(0)
		expect(tabs.selectedItems.map((x: TTabItem) => x.name)).toEqual(['c'])

		// selectAll
		tabs.selectAll()
		expect(tabs.selectedItems.map((x: TTabItem) => x.name).sort()).toEqual(
			['a', 'b', 'c'].sort(),
		)

		// clearSelection
		tabs.clearSelection()
		expect(tabs.selectedItems.length).toBe(0)

		// Переключаем в single mode — поведение: оставляем только первый выбранным
		tabs.select(0)
		tabs.select(1)
		expect(tabs.selectedItems.length).toBe(2)
		tabs.multiSelect = false
		// в single-mode должен остаться только первый выбранный
		expect(tabs.multiSelect).toBe(false)
		expect(tabs.selectedItems.length).toBe(1)
	})

	// it('getSelected возвращает массив в multi и первый элемент в single', () => {
	// 	const SelectableCtor = createSelectableControlCollection<TTabItem>()
	// 	const multi = new (SelectableCtor as any)(null, TTabItem, { multi: true }) as any

	// 	multi.addItem().name = 'a'
	// 	multi.addItem().name = 'b'

	// 	// multi mode
	// 	multi.select(0)
	// 	multi.select(1)
	// 	expect(Array.isArray(multi.getSelected())).toBe(true)
	// 	expect((multi.getSelected()[]).length).toBe(2)

	// 	// switch to single
	// 	multi.multiSelect = false
	// 	// now getSelected returns a single item (or undefined)
	// 	const singleSel = multi.getSelected()
	// 	expect(Array.isArray(singleSel)).toBe(false)
	// 	if (singleSel) expect((singleSel).name).toBeDefined()
	// })
})
