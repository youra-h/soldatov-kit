import { TCollection } from './../collection.class'
import { TCollectionItem } from './../item/collection-item.class'
import type { IEntity } from '../../../base/entity'
import { TEvented } from '../../../common/evented'

export interface ICollectionItemOptions {
	collection?: TCollection
}

/**
 * Utility-тип: добавляет `collection` к любым опциям компонента.
 * Используется в компонентах, которые являются элементами коллекции (например, TTabItem, TTreeItem).
 */
export type TWithCollectionOptions<TOptions extends object = object> =
	TOptions & ICollectionItemOptions

export interface ICollectionItemProps {}

export interface ICollectionItemMethods {
	// Освобождает ресурсы, отписывается от событий и т.д.
	free(): void
}

export type TCollectionItemEvents = {
	free: (item: TCollectionItem) => void
}

export interface ICollectionItem<
	TProps extends ICollectionItemProps = ICollectionItemProps,
	TEvents extends Record<string, (...args: any) => any> = TCollectionItemEvents,
> extends IEntity<TProps>,
		ICollectionItemMethods {
	// Ссылка на коллекцию-владелец.
	collection: TCollection | null
	// События компонента
	readonly events: TEvented<TEvents>
}
