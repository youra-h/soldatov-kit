import { TCollection } from './../collection.class'
import type { IEntity } from '../../../base/entity'
import { TEvented } from '../../../common/evented'

export interface ICollectionItemOptions {
	collection?: TCollection
}

/**
 * Utility-тип: добавляет `collection` к любым опциям компонента.
 * Используется в компонентах, которые являются элементами коллекции (например, TTabItem, TTreeItem).
 */
export type TCollectableOptions<TOptions extends object = object> = TOptions &
	ICollectionItemOptions

export interface ICollectionItemOrderable {
	order?: number
}

export interface ICollectionItemProps extends ICollectionItemOrderable {}

export interface ICollectionItemMethods {
	// Освобождает ресурсы, отписывается от событий и т.д.
	free(): void
}

export type TCollectionItemEvents<TItem = any> = {
	free: (item: TItem) => void
	'change:order': (value: number) => void
}

export interface ICollectionItem<
	TProps extends ICollectionItemProps = ICollectionItemProps,
	TEvents extends Record<string, (...args: any) => any> = TCollectionItemEvents,
>
	extends IEntity<TProps>, ICollectionItemMethods, ICollectionItemOrderable {
	// Ссылка на коллекцию-владелец.
	collection: TCollection | null
	// События компонента
	readonly events: TEvented<TEvents>
}
