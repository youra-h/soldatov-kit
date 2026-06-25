import type { ICollection, TCollectionEvents, ICollectionProps } from '../types'
import type { ICollectionItem, TCollectionItemEvents, ICollectionItemProps } from '../item/types'

/**
 * Свойства элемента коллекции с поддержкой выбора.
 */
export interface ISelectableCollectionItemProps extends ICollectionItemProps {
	/** Признак выбранности элемента */
	selected?: boolean
}

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
export interface ISelectableCollectionProps extends ICollectionProps<ISelectableCollectionItem> {
	/** Признак множественного выбора */
	mode: TSelectionMode
}

/**
 * События коллекции с поддержкой выбора.
 */
export type TSelectableCollectionEvents = TCollectionEvents<ISelectableCollectionItem> & {
	/**
	 * После выбора элемента.
	 * @param payload.collection Коллекция, в которой выбран элемент
	 * @param payload.item       Выбранный элемент
	 */
	'item:selected': (payload: {
		collection: ISelectableCollection
		item: ISelectableCollectionItem
	}) => void

	/**
	 * После отмены выбора элемента.
	 * @param payload.collection Коллекция, в которой отменен выбор
	 * @param payload.item       Элемент, с которого снят выбор
	 */
	'item:unselected': (payload: {
		collection: ISelectableCollection
		item: ISelectableCollectionItem
	}) => void

	/**
	 * После очистки всех выбранных элементов.
	 * @param payload.collection Коллекция, в которой очищен выбор
	 */
	'selection:cleared': (payload: { collection: ISelectableCollection }) => void

	/**
	 * После изменения набора выделенных элементов.
	 */
	'change:selected': (items: ISelectableCollectionItem[]) => void

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
	TMeta = Record<string, unknown>,
> extends ICollection<TProps, TEvents, TItem, TMeta> {
	/** Текущий режим выбора */
	mode: TSelectionMode
	readonly selected: TItem[]
	/** Количество выбранных элементов */
	readonly selectedCount: number
	/** Очистить выбор */
	clear(): void
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
