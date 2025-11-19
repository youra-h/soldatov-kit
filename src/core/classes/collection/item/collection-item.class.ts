import { TCollection } from '../collection.class'
import type { ICollectionItem, ICollectionItemProps, TCollectionItemEvents } from './types'
import { TObject } from '../../object'
import { TEvented } from '../../../common/evented'

/**
 * Элемент коллекции.
 */
export abstract class TCollectionItem<
		TProps extends ICollectionItemProps = ICollectionItemProps,
		TEvents extends TCollectionItemEvents = TCollectionItemEvents,
	>
	extends TObject<TProps>
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
	 * Копирует данные из другого элемента.
	 * По умолчанию копирует только id, наследники расширяют логику.
	 * @param source Источник данных для копирования.
	 */
	assign(source: Partial<TProps>): void {
		if (!source) return
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
