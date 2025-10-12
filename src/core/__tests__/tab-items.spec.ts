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
		const t1 = tabs.addItem() as TTabItem
		t1.text = 'Главная'
		t1.name = 'main'

		const t2 = tabs.addItem() as TTabItem
		t2.text = 'Профиль'
		t2.name = 'profile'

		const t3 = tabs.addItem() as TTabItem
		t3.text = 'Настройки'
		t3.name = 'settings'

		const arr = tabs.toArray()
		expect(arr.length).toBe(3)
		expect(arr.map((x) => x.text)).toEqual(['Главная', 'Профиль', 'Настройки'])
		expect(t1 instanceof TTabItem).toBe(true)
		expect(t2.name).toBe('profile')
	})

	it('чтение/запись свойств элементов коллекции', () => {
		const [t1, t2, t3] = [tabs.addItem(), tabs.addItem(), tabs.addItem()] as TTabItem[]
		t1.text = 'A'
		t2.visible = false
		t3.hidden = true
		t1.size = 'md'

		expect(t1.text).toBe('A')
		expect(t2.visible).toBe(false)
		expect(t3.hidden).toBe(true)
		expect(t1.size).toBe('md')
	})

	it('single-select: selectByIndex и selectByName работают и обновляют selected', () => {
		const t1 = tabs.addItem() as TTabItem
		t1.name = 'main'
		const t2 = tabs.addItem() as TTabItem
		t2.name = 'profile'
		const t3 = tabs.addItem() as TTabItem
		t3.name = 'settings'

		// По индексу
		tabs.selectByIndex(1)
		expect(Array.isArray(tabs.getSelected())).toBe(false) // getSelected возвращает один элемент в single-mode
		expect((tabs.getSelected() as TTabItem).name).toBe('profile')
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
		expect((tabs.getSelected() as TTabItem).name).toBe('settings')
		expect(t3.selected).toBe(true)
		expect(tabs.selectedItems.length).toBe(1)
	})

	it('single-select: выбор нового элемента снимает предыдущий', () => {
		const t1 = tabs.addItem() as TTabItem
		t1.name = 'a'
		const t2 = tabs.addItem() as TTabItem
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
		expect((tabs.getSelected() as TTabItem).name).toBe('b')

		tabs.delete(1) // удаляем 'b'
		expect(tabs.toArray().length).toBe(2)
		// after removal selection should be cleared or adjusted by implementation; проверим, что нет ссылки на удалённый элемент
		const sel = tabs.selectedItems
		expect(sel.every((s) => tabs.toArray().includes(s))).toBe(true)
	})

	// it('multi-select: переключение режима через multiSelect геттер/сеттер', () => {
	// 	// создаём multi-select коллекцию через фабрику
	// 	const SelectableCtor = createSelectableControlCollection<TTabItem>()
	// 	const multi = new (SelectableCtor as any)(null, TTabItem, { multi: true }) as any

	// 	// добавляем элементы
	// 	multi.addItem().name = 'a'
	// 	multi.addItem().name = 'b'
	// 	multi.addItem().name = 'c'

	// 	// убедимся, что режим multi включён и доступен через геттер
	// 	expect(multi.multiSelect).toBe(true)

	// 	// выбор нескольких
	// 	multi.select(0)
	// 	multi.select(2)
	// 	expect(multi.selectedItems.map((x: TTabItem) => x.name)).toEqual(['a', 'c'])

	// 	// снять первый
	// 	multi.deselect(0)
	// 	expect(multi.selectedItems.map((x: TTabItem) => x.name)).toEqual(['c'])

	// 	// selectAll
	// 	multi.selectAll()
	// 	expect(multi.selectedItems.map((x: TTabItem) => x.name).sort()).toEqual(
	// 		['a', 'b', 'c'].sort(),
	// 	)

	// 	// clearSelection
	// 	multi.clearSelection()
	// 	expect(multi.selectedItems.length).toBe(0)

	// 	// Переключаем в single mode — поведение: оставляем только первый выбранным
	// 	multi.select(0)
	// 	multi.select(1)
	// 	expect(multi.selectedItems.length).toBe(2)
	// 	multi.multiSelect = false
	// 	// в single-mode должен остаться только первый выбранный
	// 	expect(multi.multiSelect).toBe(false)
	// 	expect(multi.selectedItems.length).toBe(1)
	// })

	// it('getSelected возвращает массив в multi и первый элемент в single', () => {
	// 	const SelectableCtor = createSelectableControlCollection<TTabItem>()
	// 	const multi = new (SelectableCtor as any)(null, TTabItem, { multi: true }) as any

	// 	multi.addItem().name = 'a'
	// 	multi.addItem().name = 'b'

	// 	// multi mode
	// 	multi.select(0)
	// 	multi.select(1)
	// 	expect(Array.isArray(multi.getSelected())).toBe(true)
	// 	expect((multi.getSelected() as TTabItem[]).length).toBe(2)

	// 	// switch to single
	// 	multi.multiSelect = false
	// 	// now getSelected returns a single item (or undefined)
	// 	const singleSel = multi.getSelected()
	// 	expect(Array.isArray(singleSel)).toBe(false)
	// 	if (singleSel) expect((singleSel as TTabItem).name).toBeDefined()
	// })
})
