import type { TCollectionItem } from '../collection-item.class'

export type TIndexOrItem<T> = T | number

export interface ISelectable {
	// Выбран ли элемент
	selected: boolean
}

export interface ISelectableCollection<TItem extends TCollectionItem> {
	/**
	 * Выделение нескольких элементов одновременно.
	 * @param itemOrIndex Элемент или его индекс
	 */
	select(itemOrIndex: TIndexOrItem<TItem>): void
	/** Снять выделение с элемента */
	deselect(itemOrIndex: TIndexOrItem<TItem>): void
	/** Переключить выделение элемента */
	toggle(itemOrIndex: TIndexOrItem<TItem>): void
	/** Выделить все элементы (только для multiSelect) */
	selectAll(): void
	/** Снять выделение со всех элементов */
	clearSelection(): void
	/** Получить массив выделенных элементов */
	getSelected(): TItem[] | TItem | undefined
	/** Проверить, выделен ли элемент */
	isSelected(itemOrIndex: TIndexOrItem<TItem>): boolean
	/** Массив выделенных элементов */
	readonly selectedItems: TItem[]
}
