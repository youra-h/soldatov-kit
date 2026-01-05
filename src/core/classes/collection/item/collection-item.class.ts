import { TCollection } from '../collection.class'
import type { ICollectionItem, ICollectionItemProps, TCollectionItemEvents } from './types'
import { TEntity } from '../../../base/entity'
import { TEvented } from '../../../common/evented'

/**
 * Элемент коллекции.
 */
export abstract class TCollectionItem<
		TProps extends ICollectionItemProps = ICollectionItemProps,
		TEvents extends TCollectionItemEvents = TCollectionItemEvents,
	>
	extends TEntity<TProps>
	implements ICollectionItem
{
	/**
	 * Ссылка на коллекцию-владелец.
	 * @readonly
	 */
	private _collection: TCollection | null = null
	// События
	public readonly events: TEvented<TEvents>

	constructor(collection?: TCollection) {
		super()

		if (collection) {
			this._collection = collection
		}

		this.events = new TEvented<TEvents>()
	}

	get collection(): TCollection | null {
		return this._collection
	}

	set collection(value: TCollection | null) {
		this._collection = value
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			collection: this._collection,
		}
	}

	/**
	 * Освобождает ресурсы, отписывается от событий и т.д.
	 * Вызывается перед удалением элемента из коллекции или при явном освобождении.
	 */
	free(): void {
		this._collection = null
		this.events.emit('free', this)
	}
}
