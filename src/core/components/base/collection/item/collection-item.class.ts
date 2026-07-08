import { TCollection } from '../collection.class'
import type {
	ICollectionItem,
	ICollectionItemOptions,
	ICollectionItemProps,
	TCollectionItemEvents,
} from './types'
import { TEntity } from '../../entity'
import { TEvented } from '../../../../common'

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

	/**
	 * Позиционный индекс элемента в коллекции. Проставляется коллекцией автоматически.
	 */
	protected _order: number = 0

	// События
	public readonly events: TEvented<TEvents>

	constructor(options: ICollectionItemOptions = {}) {
		super()

		if (options.collection) {
			this._collection = options.collection
		}

		this.events = new TEvented<TEvents>()
	}

	get collection(): TCollection | null {
		return this._collection
	}

	set collection(value: TCollection | null) {
		this._collection = value
	}

	get order(): number {
		return this._order
	}

	set order(value: number) {
		if (this._order === value) return

		this._order = value
		;(this.events as TEvented<TCollectionItemEvents>).emit('change:order', value)
	}

	/**
	 * Освобождает ресурсы, отписывается от событий и т.д.
	 * Вызывается перед удалением элемента из коллекции или при явном освобождении.
	 */
	free(): void {
		this._collection = null
		;(this.events as TEvented<TCollectionItemEvents>).emit('free', this)
	}
}
