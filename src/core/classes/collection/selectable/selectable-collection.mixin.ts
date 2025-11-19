import type { TConstructor } from '../../../common/types'
import type { TCollectionOwned } from '../collection-owned.class'
import type { TCollectionItem } from '../item/collection-item.class'
import type { ISelectableCollection, TIndexOrItem } from './types'
import { TControlCollection } from '../control/control-collection.class'
import type { AbstractControlItem } from '../control/control-item.class'
import type { ICollection } from '../types'

type BaseCtorArgs = [owner?: any, itemClass?: any, opts?: { multiSelect?: boolean }]

// Конструктор базовой коллекции-владельца, который гарантирует методы ICollection
type TCollectionOwnedCtor<TItem extends TCollectionItem> = new (
	owner: any,
	itemClass: TConstructor<TItem>,
	opts?: any,
) => TCollectionOwned<TItem> & ICollection<TItem>

/**
 * Mixin, который добавляет в коллекцию поведение выбора элементов.
 * Base должен быть классом коллекции, реализующим базовые методы:
 *  - add()/insert()/delete()/clear()/getItem(index)/count/forEach()
 *
 * @template TBase - базовый тип коллекции
 * @template TItem - тип элемента коллекции
 * @param Base - базовый класс коллекции
 * @returns Класс, расширяющий базу поведением выбора
 */
export function SelectableCollectionMixin<
	TItem extends TCollectionItem,
	TBase extends TConstructor<TCollectionOwned<TItem>>,
>(Base: TBase) {
	return class TSelectableCollection extends (Base as unknown as TCollectionOwnedCtor<TItem>) {
		/** Флаг множественного выбора (true — можно выбрать несколько) */
		protected _multiSelect: boolean

		/** Массив выбранных элементов (ссылки на сами элементы) */
		protected _selectedItems: TItem[] = []

		/**
		 * Конструктор коллекции с поддержкой выбора.
		 * @param args[0] owner - владелец коллекции
		 * @param args[1] itemClass - класс элемента
		 * @param args[2] opts - настройки (multiSelect: boolean, disabled: boolean)
		 */
		constructor(...args: BaseCtorArgs) {
			const owner = args[0]
			const itemClass = args[1]
			const opts = args[2] || {}

			super(owner, itemClass, opts)

			this._multiSelect = !!opts.multiSelect
		}

		get multiSelect(): boolean {
			return this._multiSelect
		}

		set multiSelect(value: boolean) {
			if (this._multiSelect === !!value) return

			this._multiSelect = !!value

			if (!value && this._selectedItems.length > 1) {
				// Переход в single-select — оставляем выбранным только первый
				const first = this._selectedItems[0]

				for (const it of this._selectedItems.slice(1)) {
					;(it as any).selected = false
				}

				this._selectedItems.length = 0

				if (first) {
					this._selectedItems.push(first)
				}
			}
		}

		/**
		 * Возвращает массив выбранных элементов.
		 * @returns массив выбранных элементов
		 */
		get selectedItems(): TItem[] {
			return this._selectedItems
		}

		/**
		 * Возвращает массив выбранных элементов
		 * @returns массив выбранных элементов
		 */
		getSelected(): TItem[] {
			return this._selectedItems
		}

		/**
		 * Возвращает единственный выбранный элемент (если multiSelect = false), иначе undefined.
		 * @returns выбранный элемент или undefined
		 */
		getSingleSelected(): TItem | undefined {
			if (this._multiSelect) return undefined

			return this._selectedItems[0]
		}

		/**
		 * Преобразует индекс или элемент в сам элемент коллекции.
		 * @param itemOrIndex - индекс или элемент
		 * @returns элемент коллекции или undefined
		 */
		protected _normalize(itemOrIndex: TIndexOrItem<TItem>): TItem | undefined {
			if (typeof itemOrIndex === 'number') {
				return (this as any).getItem(itemOrIndex) as TItem | undefined
			}

			return itemOrIndex as TItem | undefined
		}

		/**
		 * Проверяет, выбран ли элемент.
		 * @param itemOrIndex - индекс или элемент
		 * @returns true, если элемент выбран
		 */
		isSelected(itemOrIndex: TIndexOrItem<TItem>): boolean {
			const it = this._normalize(itemOrIndex)

			if (!it) return false

			return this._selectedItems.indexOf(it) !== -1
		}

		/**
		 * Выбирает элемент. В режиме single-select снимает выбор с других.
		 * @param itemOrIndex - индекс или элемент
		 */
		select(itemOrIndex: TIndexOrItem<TItem>): void {
			const it = this._normalize(itemOrIndex)

			if (!it || this.isSelected(it)) return

			if (!this._multiSelect) {
				for (const prev of this._selectedItems.slice()) {
					;(prev as any).selected = false
				}
				this._selectedItems.length = 0
			}

			;(it as any).selected = true
			this._selectedItems.push(it)
		}

		/**
		 * Выбирает элемент по идентификатору.
		 * @param id - идентификатор элемента
		 * @returns true, если элемент с таким идентификатором найден и выбран, иначе false
		 */
		selectById(id: number | string): TItem | undefined {
			const arr = (this as any).toArray() as TItem[]

			const found = arr.find((it) => it.id === id)

			if (!found) return undefined

			this.select(found)

			return found
		}

		/**
		 * Снимает выбор с элемента.
		 * @param itemOrIndex - индекс или элемент
		 */
		deselect(itemOrIndex: TIndexOrItem<TItem>): void {
			const it = this._normalize(itemOrIndex)

			if (!it) return

			const idx = this._selectedItems.indexOf(it)

			if (idx === -1) {
				;(it as any).selected = false
				return
			}

			this._selectedItems.splice(idx, 1)
		}

		/**
		 * Переключает состояние выбора элемента.
		 * @param itemOrIndex - индекс или элемент
		 */
		toggle(itemOrIndex: TIndexOrItem<TItem>): void {
			const it = this._normalize(itemOrIndex)

			if (!it) return

			if (this.isSelected(it)) {
				this.deselect(it)
			} else {
				this.select(it)
			}
		}

		/**
		 * Выбирает все элементы коллекции (только в режиме multiSelect).
		 * В режиме single-select выбирает только первый.
		 */
		selectAll(): void {
			if (!this._multiSelect) {
				const it = (this as any).getItem(0) as TItem | undefined

				if (it) {
					this.select(it)
				}

				return
			}

			;(this as any).forEach((item: TItem) => {
				if (!this.isSelected(item)) {
					;(item as any).selected = true
					this._selectedItems.push(item)
				}
			})
		}

		/**
		 * Снимает выбор со всех элементов.
		 */
		clearSelection(): void {
			for (const it of this._selectedItems.slice()) {
				;(it as any).selected = false
			}

			this._selectedItems.length = 0
		}

		/**
		 * Внутренний хук — вызывается при удалении элемента из коллекции.
		 * Удаляет элемент из массива выбранных.
		 * @param item - удаляемый элемент
		 */
		protected _onItemRemovedHook(item: TItem): void {
			const idx = this._selectedItems.indexOf(item)

			if (idx !== -1) {
				this._selectedItems.splice(idx, 1)
			}
		}

		/**
		 * Удаляет элемент по индексу и синхронизирует выбор.
		 * @param index - индекс элемента
		 * @return true, если элемент был удалён, false если индекс вне диапазона
		 */
		delete(index: number): boolean {
			const item = (this as any).getItem(index) as TItem | undefined

			const result = super.delete(index)

			if (item) {
				this._onItemRemovedHook(item)
			}

			return result
		}

		/**
		 * Очищает коллекцию и сбрасывает выбор.
		 */
		clear(): void {
			super.clear()
			this._selectedItems.length = 0
		}
	}
}

/**
 * Фабрика создания коллекции с поддержкой выбора и контролов.
 * @template TItem - тип элемента коллекции
 * @returns Класс коллекции с поддержкой выбора и контролов
 */
export function SelectableControlCollection<TItem extends AbstractControlItem<any>>() {
	const Mixed = SelectableCollectionMixin<TItem, typeof TControlCollection>(TControlCollection)

	return Mixed as unknown as new (
		owner: any,
		itemClass: TConstructor<TItem>,
		opts?: { multiSelect?: boolean },
	) => ISelectableCollection<TItem> & TControlCollection<TItem, any>
}

import type { IHasName } from '../../base-control'
import type { IHasValue } from '../../control-value/types'
// Расширения коллекций с selectedByName и selectedByValue
import type { TSelectableControlCtor, TSelectableByNameCtor, TSelectableByValueCtor } from './types'

/** Генератор класса с selectByName */
export function makeSelectableByName<TItem extends AbstractControlItem<any> & IHasName>() {
	const Base = SelectableControlCollection<TItem>() as unknown as TSelectableControlCtor<TItem>

	/** Класс коллекции с поддержкой выбора по имени. */
	class SelectableByName extends Base {
		/**
		 * Выбирает элемент по имени.
		 * @param name - имя элемента
		 * @returns выбранный элемент или undefined
		 */
		selectByName(name: string): TItem | undefined {
			if (!name) return undefined

			const arr = this.toArray() as TItem[]

			const found = arr.find((it) => it.name === name)

			if (!found) return undefined

			this.select(found)

			return found
		}
	}

	return SelectableByName as unknown as TSelectableByNameCtor<TItem>
}

/** Генератор класса с selectByValue */
export function makeSelectableByValue<
	TItem extends AbstractControlItem<any> & IHasName & IHasValue,
>() {
	// получаем типизированный конструктор с selectByName
	const BaseByName = makeSelectableByName<TItem>() as unknown as TSelectableByNameCtor<TItem>

	/** Класс коллекции с поддержкой выбора по значению. */
	class SelectableByValue extends BaseByName {
		/**
		 * Выбирает элемент по значению.
		 * @param value - значение элемента
		 * @returns выбранный элемент или undefined
		 */
		selectByValue(value: any): TItem | undefined {
			const arr = this.toArray() as TItem[]

			const found = arr.find((it) => it.value === value)

			if (!found) return undefined

			this.select(found)

			return found
		}
	}

	return SelectableByValue as unknown as TSelectableByValueCtor<TItem>
}
