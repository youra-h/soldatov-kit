import type { ICollection, TCollectionEvents, ICollectionProps } from '../types'
import type { ICollectionItem, TCollectionItemEvents, ICollectionItemProps } from '../item/types'

/**
 * Свойства элемента коллекции с поддержкой выбора.
 */
export interface ISelectableCollectionItemProps extends ICollectionItemProps {
	/** Признак выбранности элемента */
	selected: boolean
}

/**
 * События элемента коллекции с поддержкой выбора.
 */
export type TSelectableItemEvents<TItem> = TCollectionItemEvents & {
	/**
	 * После изменения состояния выбранности.
	 * @param item Элемент, у которого изменился selected
	 */
	change: (item: TItem) => void
}

export interface ISelectableCollectionItem<
	TProps extends ISelectableCollectionItemProps = ISelectableCollectionItemProps,
	// @ts-ignore
	TEvents extends TSelectableItemEvents = TSelectableItemEvents,
> extends ICollectionItem<TProps, TEvents>,
		ISelectableCollectionItemProps {}

export type TSelectionMode = 'none' | 'single' | 'multiple'

/**
 * Свойства коллекции с поддержкой выбора.
 */
export interface ISelectableCollectionProps extends ICollectionProps {
	/** Признак множественного выбора */
	mode: TSelectionMode
}

/**
 * События коллекции с поддержкой выбора.
 */
export type TSelectableCollectionEvents = TCollectionEvents & {
	/**
	 * После изменения выбора.
	 * @param payload.collection Коллекция, в которой изменился выбор
	 * @param payload.items      Массив выбранных элементов
	 */
	change: (payload: { collection: ISelectableCollection; items: ISelectableCollectionItem[] }) => void
}

export interface ISelectableCollection<
	TProps extends ISelectableCollectionProps = ISelectableCollectionProps,
	TEvents extends TSelectableCollectionEvents = TSelectableCollectionEvents,
	TItem extends ISelectableCollectionItem = ISelectableCollectionItem,
> extends ICollection<TProps, TEvents, TItem>,
		ISelectableCollectionProps {
	readonly selected: ISelectableCollectionItem[]
	/** Количество выбранных элементов */
	readonly selectedCount: number
	/** Очистить выбор */
	clear(): void
}
