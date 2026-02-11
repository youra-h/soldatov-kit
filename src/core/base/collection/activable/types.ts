import type { ICollection, TCollectionEvents, ICollectionProps } from '../types'
import type { ICollectionItem, TCollectionItemEvents, ICollectionItemProps } from '../item/types'

/**
 * Свойства элемента коллекции с поддержкой активности.
 */
export interface IActivatableCollectionItemProps extends ICollectionItemProps {
	/** Признак активности элемента */
	active: boolean
}

/**
 * События элемента коллекции с поддержкой активности.
 */
export type TActivatableItemEvents<TItem> = TCollectionItemEvents & {
	/**
	 * После изменения состояния активности.
	 * @param item Элемент, у которого изменился active
	 */
	change: (item: TItem) => void
}

/**
 * Интерфейс элемента коллекции с поддержкой активности.
 */
export interface IActivatableCollectionItem<
	TProps extends IActivatableCollectionItemProps = IActivatableCollectionItemProps,
	// @ts-ignore
	TEvents extends TActivatableItemEvents = TActivatableItemEvents,
> extends ICollectionItem<TProps, TEvents>,
		IActivatableCollectionItemProps {}

/**
 * Свойства коллекции с поддержкой активности.
 */
export interface IActivatableCollectionProps extends ICollectionProps {
	/** Активный элемент (undefined если нет) */
	activeItem?: IActivatableCollectionItem
}

/**
 * События коллекции с поддержкой активности.
 */
export type TActivatableCollectionEvents = TCollectionEvents & {
	/**
	 * После изменения активного элемента.
	 * @param payload.collection Коллекция, в которой изменился активный элемент
	 * @param payload.item       Новый активный элемент (или undefined)
	 */
	change: (payload: { collection: IActivatableCollection; item?: IActivatableCollectionItem }) => void
}

/**
 * Интерфейс коллекции с поддержкой активности.
 */
export interface IActivatableCollection<
	TProps extends IActivatableCollectionProps = IActivatableCollectionProps,
	TEvents extends TActivatableCollectionEvents = TActivatableCollectionEvents,
	TItem extends IActivatableCollectionItem = IActivatableCollectionItem,
> extends ICollection<TProps, TEvents, TItem>,
		IActivatableCollectionProps {
	/** Текущий активный элемент */
	readonly activeItem?: TItem
	/** Установить активный элемент */
	setActive(item: TItem): void
	/** Очистить активный элемент */
	clear(): void
}
