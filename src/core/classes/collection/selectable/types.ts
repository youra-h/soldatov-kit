import type { TCollectionItem } from '../item/collection-item.class'
import type { TConstructor } from '../../../common/types'
import { TControlCollection } from '../control/control-collection.class'
import type { AbstractControlItem } from '../control/control-item.class'
import type { IHasName } from '../../base-control/types'
import type { IHasValue } from '../../control-value/types'
import type { ICollection } from '../types'

export type TIndexOrItem<T> = T | number

export interface ISelectable {
	// Выбран ли элемент
	selected: boolean
}

export interface ISelectableCollectionProps {
	// Разрешён ли множественный выбор
	multiSelect: boolean
}

// export interface ISelectableCollection<TItem extends TCollectionItem> extends ICollection<TItem>
export interface ISelectableCollection<TItem extends TCollectionItem>
	extends ICollection<TItem>,
		ISelectableCollectionProps {
	/**
	 * Выделение нескольких элементов одновременно.
	 * @param itemOrIndex Элемент или его индекс
	 */
	select(itemOrIndex: TIndexOrItem<TItem>): void
	/** Выделить элемент по его id */
	selectById(id: number | string): TItem | undefined
	/** Снять выделение с элемента */
	deselect(itemOrIndex: TIndexOrItem<TItem>): void
	/** Переключить выделение элемента */
	toggle(itemOrIndex: TIndexOrItem<TItem>): void
	/** Выделить все элементы (только для multiSelect) */
	selectAll(): void
	/** Снять выделение со всех элементов */
	clearSelection(): void
	/** Получить массив выделенных элементов */
	getSelected(): TItem[]
	/** Получить первый выделенный элемент или undefined */
	getSingleSelected(): TItem | undefined
	/** Проверить, выделен ли элемент */
	isSelected(itemOrIndex: TIndexOrItem<TItem>): boolean
	/** Массив выделенных элементов */
	readonly selectedItems: TItem[]
}

// Тип экземпляра базовой selectable коллекции (то, что реально должны иметь объекты)
type TSelectableControlInstance<TItem extends AbstractControlItem<any>> =
	ISelectableCollection<TItem> & TControlCollection<TItem, any>

// Конструктор для базовой selectable коллекции
export type TSelectableControlCtor<TItem extends AbstractControlItem<any>> = new (
	owner?: any,
	itemClass?: TConstructor<TItem>,
	opts?: { multiSelect?: boolean },
) => TSelectableControlInstance<TItem>

// === makeSelectableByName: возвращаем конструктор, экземпляр которого имеет selectByName ===
export interface ISelectableByNameInstance<TItem extends AbstractControlItem<any> & IHasName>
	extends TSelectableControlInstance<TItem> {
	selectByName(name: string): TItem | undefined
}

export type TSelectableByNameCtor<TItem extends AbstractControlItem<any> & IHasName> = new (
	owner?: any,
	itemClass?: TConstructor<TItem>,
	opts?: { multiSelect?: boolean },
) => ISelectableByNameInstance<TItem>

export interface ISelectableByValueInstance<
	TItem extends AbstractControlItem<any> & IHasName & IHasValue,
> extends ISelectableByNameInstance<TItem> {
	selectByValue(value: any): TItem | undefined
}

export type TSelectableByValueCtor<TItem extends AbstractControlItem<any> & IHasName & IHasValue> =
	new (
		owner?: any,
		itemClass?: TConstructor<TItem>,
		opts?: { multiSelect?: boolean },
	) => ISelectableByValueInstance<TItem>

// Коллекция с поддержкой выбора по имени
export interface ISelectableByNameCollection<TItem extends AbstractControlItem<any> & IHasName>
	extends ISelectableCollection<TItem> {
	selectByName(name: string): TItem | undefined
}

export interface ISelectableByValueCollection<
	TItem extends AbstractControlItem<any> & IHasName & IHasValue,
> extends ISelectableByNameCollection<TItem> {
	selectByValue(value: any): TItem | undefined
}
