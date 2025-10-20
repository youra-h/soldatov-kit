import { TCollection } from './collection.class'
import type { TConstructor } from '../../common/types'
import { TCollectionItem } from './collection-item.class'

/**
 * Коллекция с явным владельцем.
 * Используется когда коллекция привязана к компоненту/объекту владелецу.
 */
export class TCollectionOwned<TItem extends TCollectionItem = TCollectionItem> extends TCollection<TItem> {
	/**
	 * Создаёт коллекцию и задаёт владельца.
	 * @param owner Владелец коллекции (любой объект).
	 * @param itemClass Класс элементов коллекции.
	 */
	constructor(owner: any, itemClass: TConstructor<TItem>) {
		super(itemClass)
		this.owner = owner
	}

	/**
	 * Возвращает владельца коллекции.
	 */
	getOwner(): any {
		return this.owner
	}
}
