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
	'change:activation': (item: TItem) => void
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
 * Пока нет специфичных настроек, но интерфейс оставляем для расширяемости.
 */
export interface IActivatableCollectionProps extends ICollectionProps {}

/**
 * События коллекции с поддержкой активности.
 */
export type TActivatableCollectionEvents = TCollectionEvents & {
	/**
	 * После активации элемента.
	 * @param payload.collection Коллекция, в которой активирован элемент
	 * @param payload.item       Активированный элемент
	 */
	'item:activated': (payload: {
		collection: IActivatableCollection
		item: IActivatableCollectionItem
	}) => void

	/**
	 * После деактивации элемента (активный элемент сброшен).
	 * @param payload.collection Коллекция, в которой деактивирован элемент
	 */
	'item:deactivated': (payload: { collection: IActivatableCollection }) => void
}

/**
 * Интерфейс коллекции с поддержкой активности.
 */
export interface IActivatableCollection<
	TProps extends IActivatableCollectionProps = IActivatableCollectionProps,
	TEvents extends TActivatableCollectionEvents = TActivatableCollectionEvents,
	TItem extends IActivatableCollectionItem = IActivatableCollectionItem,
> extends ICollection<TProps, TEvents, TItem> {
	/** Текущий активный элемент */
	readonly activeItem?: TItem
	/** Установить активный элемент */
	setActive(item: TItem): void
	/** Очистить активный элемент */
	clear(): void
}
