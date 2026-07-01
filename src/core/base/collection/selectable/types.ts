import type { ICollection, TCollectionEvents, ICollectionProps } from '../types'
import type {
	ICollectionItem,
	TCollectionItemEvents,
	ICollectionItemProps,
	ICollectionItemMeta,
} from '../item/types'

export interface ISelectableCollectionItemMeta extends ICollectionItemMeta {
	/** Признак выбранности элемента */
	selected?: boolean
}

/**
 * Свойства элемента коллекции с поддержкой выбора.
 */
export interface ISelectableCollectionItemProps
	extends ICollectionItemProps,
		ISelectableCollectionItemMeta {}

/**
 * События элемента коллекции с поддержкой выбора.
 */
export type TSelectableItemEvents<TItem> = TCollectionItemEvents<TItem> & {
	/**
	 * После изменения состояния выбранности.
	 * @param item Элемент, у которого изменился selected
	 */
	'change:selection': (item: TItem) => void
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
export interface ISelectableCollectionProps<
	TItem extends ISelectableCollectionItem = ISelectableCollectionItem,
> extends ICollectionProps<TItem, ISelectableCollectionItemMeta> {
	/** Признак множественного выбора */
	mode?: TSelectionMode
}

/**
 * События коллекции с поддержкой выбора.
 */
export type TSelectableCollectionEvents<
	TItem extends ISelectableCollectionItem = ISelectableCollectionItem,
> = TCollectionEvents<TItem> & {
	/**
	 * После выбора элемента.
	 * @param payload.collection Коллекция, в которой выбран элемент
	 * @param payload.item       Выбранный элемент
	 */
	'item:selected': (payload: { collection: ISelectableCollection; item: TItem }) => void

	/**
	 * После отмены выбора элемента.
	 * @param payload.collection Коллекция, в которой отменен выбор
	 * @param payload.item       Элемент, с которого снят выбор
	 */
	'item:unselected': (payload: { collection: ISelectableCollection; item: TItem }) => void

	/**
	 * После изменения набора выделенных элементов.
	 */
	'change:selected': (items: TItem[]) => void

	/**
	 * После изменения счётчика выделенных элементов.
	 */
	'change:selectedCount': (count: number) => void

	/**
	 * После изменения режима выбора.
	 */
	'change:mode': (mode: TSelectionMode) => void
}

export interface ISelectableCollection<
	TProps extends ISelectableCollectionProps = ISelectableCollectionProps,
	TEvents extends TSelectableCollectionEvents = TSelectableCollectionEvents,
	TItem extends ISelectableCollectionItem = ISelectableCollectionItem,
> extends ICollection<TProps, TEvents, TItem> {
	/** Текущий режим выбора */
	mode: TSelectionMode
	readonly selected: TItem[]
	/** Количество выбранных элементов */
	readonly selectedCount: number
	/** Очистить выбор */
	reset(): void
}

/** * Интерфейс, который SelectableComponentMixin добавляет к компоненту.
 */
export interface ISelectableComponentItem {
	collection: any | null
	order: number
	selected: boolean
	toggleSelected(): void
	select(): void
	deselect(): void
	free(): void
}
