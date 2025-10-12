<template>Test Collections console.log</template>

<script lang="ts" setup>
import { TTabItem } from './tab-item.class'
import { TabItems } from './tab-items.class'

console.log('--- Тесты TabItems и TTabItem ---')

// 1. Создание коллекции
const tabs = new TabItems()
console.log('Создана коллекция вкладок')

// 2. Добавление вкладок
const tab1 = tabs.addItem()
tab1.text = 'Главная'
tab1.name = 'main'

const tab2 = tabs.addItem()
tab2.text = 'Профиль'
tab2.name = 'profile'

const tab3 = tabs.addItem()
tab3.text = 'Настройки'
tab3.name = 'settings'

console.log(
	'Добавлены вкладки:',
	tabs.toArray().map((t) => t.text),
)

// 3. Проверка установки и чтения свойств
tab1.size = 'md'
tab2.visible = false
tab3.hidden = true

console.log('Свойства вкладок:')
tabs.forEachItem((item, i) => {
	console.log(
		`  [${i}] text=${item.text}, name=${item.name}, size=${item.size}, visible=${item.visible}, hidden=${item.hidden}`,
	)
})

// 4. Выбор вкладки по индексу
tabs.selectByIndex(1)
console.log('Выбрана вкладка по индексу 1:', tabs.getSelected()?.text)

// 5. Проверка selected-флага
tabs.forEachItem((item, i) => {
	console.log(`  [${i}] selected=${item.selected}`)
})

// 6. Снятие выбора
tabs.clearSelection()
console.log('Выбор снят. Выбранные вкладки:', tabs.getSelected())

// 7. Выбор по имени
const found = tabs.selectByName('settings')
console.log('Выбор по имени "settings":', found ? 'успешно' : 'не найдено')
console.log('Текущая выбранная вкладка:', tabs.getSelected()?.text)

// 8. Проверка single-select: выбор новой вкладки снимает предыдущую
tabs.select(tab1)
console.log('Выбрана вкладка "Главная"')
tabs.select(tab2)
console.log('Выбрана вкладка "Профиль"')
console.log(
	'Выбранные вкладки:',
	tabs.selectedItems.map((t) => t.text),
)

// 9. Удаление выбранной вкладки
tabs.delete(1)
console.log('Удалена вкладка с индексом 1')
console.log(
	'Оставшиеся вкладки:',
	tabs.toArray().map((t) => t.text),
)
console.log(
	'Выбранные вкладки после удаления:',
	tabs.selectedItems.map((t) => t.text),
)

// 10. Множественный выбор
const MultiTabItems = new (createSelectableControlCollection<TTabItem>())(null, TTabItem, {
	multi: true,
})
MultiTabItems.addItem().name = 'a'
MultiTabItems.addItem().name = 'b'
MultiTabItems.addItem().name = 'c'

MultiTabItems.select(0)
MultiTabItems.select(2)
console.log(
	'Multi-select: выбраны вкладки:',
	MultiTabItems.selectedItems.map((t) => t.name),
)

MultiTabItems.deselect(0)
console.log(
	'После снятия выбора с первой:',
	MultiTabItems.selectedItems.map((t) => t.name),
)

MultiTabItems.selectAll()
console.log(
	'После selectAll():',
	MultiTabItems.selectedItems.map((t) => t.name),
)

MultiTabItems.clearSelection()
console.log(
	'После clearSelection():',
	MultiTabItems.selectedItems.map((t) => t.name),
)

console.log('--- Тесты завершены ---')
</script>
