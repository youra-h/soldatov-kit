import { describe, it, expect, beforeEach } from 'vitest'
import { TTabs, TTabItem } from '../classes/tabs'

describe('TTabs (TTabs / TTabItem)', () => {
	let tabs: TTabs

	beforeEach(() => {
		tabs = new TTabs()
	})

	it('Устанавливает text по умолчанию', () => {
		const tab = new TTabItem()
		expect(tab.text).toBe('Tab item')
	})

	it('Добавляет вкладки и возвращает корректные элементы', () => {
		const t1 = tabs.collection.add()
		t1.text = 'Главная'
		t1.name = 'main'

		const t2 = tabs.addTab()
		t2.text = 'Профиль'
		t2.name = 'profile'

		const t3 = tabs.addTab()
		t3.text = 'Настройки'
		t3.name = 'settings'

		const arr = tabs.getTabs()

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

	it('Чтение/запись свойств элементов коллекции', () => {
		const [t1, t2, t3] = [tabs.addTab(), tabs.addTab(), tabs.addTab()]
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
		const t1 = tabs.collection.add()
		t1.name = 'a'
		const t2 = tabs.collection.add()
		t2.name = 'b'
		const t3 = tabs.collection.add()
		t3.name = 'c'

		// Вставка таба по индексу
		const t1_5 = tabs.collection.insertItem(1)
		t1_5.name = 'a.5'
		expect(tabs.collection.toArray().map((x) => x.name)).toEqual(['a', 'a.5', 'b', 'c'])

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
		expect(Array.isArray(tabs.getSelected())).toBe(true) // getSelected возвращает один элемент в single-mode
		expect(tabs.getSelected()!.length).toBe(1) // getSelected возвращает один элемент в single-mode
		const tab = tabs.getSingleSelected() as TTabItem | undefined
		expect(tab).toBeDefined()
		if (tab) expect(tab.name).toBe('profile')
		expect(t2.selected).toBe(true)
		expect(tabs.selectedItems.length).toBe(1)

		const tabProfile = tabs.getSingleSelected() as TTabItem
		expect(tabProfile.name).toBe('profile')
		expect(t2.selected).toBe(true)
		expect(tabs.selectedItems.length).toBe(1)

		// Снятие выбора
		tabs.clearSelection()
		expect(tabs.getSingleSelected()).toBeUndefined()
		expect(t2.selected).toBe(false)
		expect(tabs.selectedItems.length).toBe(0)

		// По имени
		let tabSettings = tabs.selectByName('settings')
		expect(tabSettings).toBeDefined()

		tabSettings = tabs.getSingleSelected() as TTabItem
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

	it('Удаление элемента корректно синхронизирует selection', () => {
		tabs.addItem().name = 'a'
		tabs.addItem().name = 'b'
		tabs.addItem().name = 'c'

		tabs.selectByIndex(1) // выбираем 'b'
		const tab = tabs.getSingleSelected() as TTabItem
		expect(tab.name).toBe('b')

		tabs.delete(1) // удаляем 'b'
		expect(tabs.toArray().length).toBe(2)
		// after removal selection should be cleared or adjusted by implementation; проверим, что нет ссылки на удалённый элемент
		const sel = tabs.selectedItems
		expect(sel.every((s) => tabs.toArray().includes(s))).toBe(true)
	})

	it('multi-select: переключение режима через multiSelect геттер/сеттер', () => {
		// создаём multi-select коллекцию через фабрику
		// const SelectableCtor = SelectableControlCollection<TTabItem>()
		// const multi = new (SelectableCtor as any)(null, TTabItem, { multiSelect: true }) as any
		// const multi = tabs;
		// Включить режим multi-select
		tabs.multiSelect = true

		// добавляем элементы
		tabs.addItem().name = 'a'
		tabs.addItem().name = 'b'
		tabs.addItem().name = 'c'

		// убедимся, что режим multiSelect включён и доступен через геттер
		expect(tabs.multiSelect).toBe(true)

		// выбор нескольких
		tabs.select(0)
		tabs.select(2)
		expect(tabs.getSelected().map((x: TTabItem) => x.name)).toEqual(['a', 'c'])

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

	it('getSelected возвращает массив в multiSelect и первый элемент в single', () => {
		// const SelectableCtor = SelectableControlCollection<TTabItem>()
		// const multi = new (SelectableCtor as any)(null, TTabItem, { multiSelect: true }) as any
		// Включить режим multiSelect
		tabs.multiSelect = true

		tabs.addItem().name = 'a'
		tabs.addItem().name = 'b'

		// multiSelect mode
		tabs.select(0)
		tabs.select(1)
		expect(Array.isArray(tabs.getSelected())).toBe(true)
		expect(tabs.getSelected().length).toBe(2)

		// switch to single
		tabs.multiSelect = false
		// now getSelected returns a single item (or undefined)
		const singleSel = tabs.getSingleSelected() as TTabItem | undefined
		expect(Array.isArray(singleSel)).toBe(false)

		if (singleSel) expect(singleSel.name).toBeDefined()
	})

	it('selectByValue выделяет вкладку по value', () => {
		const t1 = tabs.addItem()
		t1.value = 'main'
		const t2 = tabs.addItem()
		t2.value = 'profile'
		const t3 = tabs.addItem()
		t3.value = 'settings'

		// Выделяем по value
		const tabProfile = tabs.selectByValue('profile')
		expect(tabProfile).toBeDefined()

		const selected = tabs.getSingleSelected() as TTabItem
		expect(selected.value).toBe('profile')
		expect(selected.selected).toBe(true)
		expect(t2.selected).toBe(true)
		expect(tabs.selectedItems.length).toBe(1)
		tabs.clearSelection()

		// Попытка выделить несуществующее value
		const tabNotFound = tabs.selectByValue('nonexistent')
		expect(tabNotFound).toBeUndefined()

		expect(tabs.selectedItems.length).toBe(0)
	})
})
