import type { ICollection, TCollectionEvents, ICollectionProps } from '../types'
import type {
	ICollectionItem,
	TCollectionItemEvents,
	ICollectionItemProps,
	ICollectionItemMeta,
} from '../item/types'

export interface IActivatableCollectionItemMeta extends ICollectionItemMeta {
	/** Признак активности элемента */
	active?: boolean
}
/**
 * Свойства элемента коллекции с поддержкой активности.
 */
export interface IActivatableCollectionItemProps
	extends ICollectionItemProps,
		IActivatableCollectionItemMeta {}

/**
 * События элемента коллекции с поддержкой активности.
 */
export type TActivatableItemEvents<TItem> = TCollectionItemEvents<TItem> & {
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
export interface IActivatableCollectionProps<
	TItem extends IActivatableCollectionItem = IActivatableCollectionItem,
> extends ICollectionProps<TItem, IActivatableCollectionItemMeta> {}

/**
 * События коллекции с поддержкой активности.
 */
export type TActivatableCollectionEvents = TCollectionEvents<IActivatableCollectionItem> & {
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

	/**
	 * Внутренний запрос предиката для поиска следующего активируемого элемента.
	 * Обработчик возвращает функцию-предикат или undefined.
	 */
	'resolve:_activatablePredicate': () =>
		| ((item: IActivatableCollectionItem) => boolean)
		| undefined
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
	reset(): void
	/**
	 * Найти первый подходящий элемент для активации.
	 * Поиск начинается с соседних от fromItem позиций (сначала следующий, потом предыдущий).
	 * @param predicate Условие отбора элемента (опционально — без условия подходит любой)
	 * @param fromItem  Элемент-ориентир, от которого начинается поиск (опционально)
	 */
	findActivatable(predicate?: (item: TItem) => boolean, fromItem?: TItem): TItem | undefined
}

/**
 * Интерфейс, который ActivatableComponentMixin добавляет к компоненту.
 */
export interface IActivatableComponentItem {
	collection: any | null
	order: number
	active: boolean
	toggleActive(): void
	free(): void
}
