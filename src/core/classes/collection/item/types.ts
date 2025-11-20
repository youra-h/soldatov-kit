import { TCollection } from './../collection.class'
import { TCollectionItem } from './../item/collection-item.class'
import type { IObject } from '../../object'
import { TEvented } from '../../../common/evented'

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
> extends IObject<TProps>,
		ICollectionItemMethods {
	// Ссылка на коллекцию-владелец.
	collection: TCollection | null
	// События компонента
	readonly events: TEvented<TEvents>
}
