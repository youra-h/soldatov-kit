// import '@/assets/main.css'
// import '@packages/theme/index.css'

// import { createApp } from 'vue'
// import App from './AppCollections.vue'

// createApp(App).mount('#app')

import {
	HierarchicalCollectionWithStrategy,
	SingleActiveStrategy,
	MultipleSelectionStrategy,
	SingleSelectionStrategy,
} from '../src/core/classes/collection/hierarchical/index.ts'

import { TActivatableCollection, TActivatableCollectionItem } from '../src/core/classes/collection'
import { TSelectableCollection } from '../src/core/classes/collection'

// Создаём дерево с стратегией "один активный элемент"
{
	let tree = new HierarchicalCollectionWithStrategy(new SingleActiveStrategy())

	let numbersA = new TActivatableCollection()
	let numbersB = new TActivatableCollection()

	tree.add(numbersA)
	tree.add(numbersB)

	// Добавляем элементы (например, числа)
	let numA1 = numbersA.add({ value: 10 })
	let numA2 = numbersA.add({ value: 20 })
	let numB1 = numbersB.add({ value: 30 })

	// Активируем элемент 10
	numbersA.setActive(numA1)
	console.log('Активный элемент:', tree.activeItem.value) // → объект numA1

	// Активируем элемент 30
	numbersB.setActive(numB1)
	console.log('Активный элемент:', tree.activeItem.value) // → объект numB1
}

{
	// Создаём дерево с стратегией "множественный выбор"
	let tree = new HierarchicalCollectionWithStrategy(new MultipleSelectionStrategy())

	// Добавляем коллекции файлов
	let filesA = new TSelectableCollection({ mode: 'multiple' })
	let filesB = new TSelectableCollection({ mode: 'multiple' })

	tree.add(filesA)
	tree.add(filesB)

	// Добавляем файлы
	let fileA1 = filesA.add({ name: 'fileA1.txt' })
	let fileA2 = filesA.add({ name: 'fileA2.txt' })
	let fileB1 = filesB.add({ name: 'fileB1.txt' })
	let fileB2 = filesB.add({ name: 'fileB2.txt' })

	// Выбираем несколько файлов
	fileA1.selected = true
	fileB1.selected = true

	console.log(
		'Выбранные файлы:',
		tree.selectedItems.map((f) => f.name),
	)

	fileA1.selected = false

	console.log(
		'Выбранные файлы:',
		tree.selectedItems.map((f) => f.name),
	)
}

{
	// Создаём дерево с стратегией "одиночный выбор"
	let tree = new HierarchicalCollectionWithStrategy(new SingleSelectionStrategy())

	// Добавляем коллекции
	let filesA = new TSelectableCollection({ mode: 'single' })
	let filesB = new TSelectableCollection({ mode: 'single' })

	tree.add(filesA)
	tree.add(filesB)

	// Добавляем файлы
	let fileA1 = filesA.add({ name: 'fileA1.txt' })
	let fileB1 = filesB.add({ name: 'fileB1.txt' })
	let fileA2 = filesA.add({ name: 'fileA2.txt' })
	let fileB2 = filesB.add({ name: 'fileB2.txt' })

	// Выбираем по одному файлу в каждой коллекции
	fileA1.selected = true
	fileB1.selected = true
	fileB2.selected = true // снимает выбор с fileB1

	console.log(
		'Выбранные файлы:',
		tree.selectedItems.map((f) => f.name),
	)
	// → ['fileA1.txt', 'fileB1.txt']
}

{
	// Элемент меню с поддержкой expanded
	class MenuItem extends TActivatableCollectionItem {
		private _expanded = false

		get expanded(): boolean {
			return this._expanded
		}

		expand(): void {
			this._expanded = true
		}

		collapse(): void {
			this._expanded = false
		}

		toggleExpanded(): void {
			this._expanded = !this._expanded
		}
	}

	// Главное меню как дерево
	const mainMenu = new HierarchicalCollectionWithStrategy(new SingleActiveStrategy())

	// Верхний уровень меню
	const menuCollection = new TActivatableCollection({ itemClass: MenuItem })
	mainMenu.add(menuCollection)

	// Добавляем пункты меню
	const fileMenu = menuCollection.add({ name: 'Файл' }) as MenuItem
	const editMenu = menuCollection.add({ name: 'Правка' }) as MenuItem

	// Дочерние коллекции для пунктов меню
	const fileSubMenu = new TSelectableCollection({ mode: 'single' })
	mainMenu.add(fileSubMenu)

	fileSubMenu.add({ name: 'Открыть' })
	fileSubMenu.add({ name: 'Сохранить' })
	fileSubMenu.add({ name: 'Выход' })

	// Пример использования
	menuCollection.setActive(fileMenu) // активируем пункт "Файл"
	fileMenu.expand() // раскрываем его
	console.log('Активный пункт меню:', mainMenu.activeItem) // → "Файл"
	console.log(
		'Дочерние действия:',
		fileSubMenu.toArray().map((i) => i.name),
	)
}
