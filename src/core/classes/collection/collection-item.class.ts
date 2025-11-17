import { TCollection } from './collection.class'
import type { ICollectionItem, ICollectionItemProps } from './types'
import { TObject } from '../object'

/**
 * Элемент коллекции.
 */
export abstract class TCollectionItem<TProps extends ICollectionItemProps = ICollectionItemProps>
	extends TObject<TProps>
	implements ICollectionItem
{
	/**
	 * Ссылка на коллекцию-владелец.
	 * @readonly
	 */
	private _collection: TCollection | null = null

	private _index: number = -1

	constructor(collection?: TCollection) {
		super()

		if (collection) {
			this._collection = collection
		}
	}

	get collection(): TCollection | null {
		return this._collection
	}

	set collection(value: TCollection | null) {
		this._collection = value
	}

	/**
	 * Текущее положение элемента в коллекции.
	 */
	get index(): number {
		return this._index
	}

	/**
	 * Запрос на изменение индекса элемента.
	 * Если элемент прикреплён к коллекции, делегирует операцию коллекции,
	 * иначе устанавливает индекс напрямую.
	 * @param value Новый индекс элемента.
	 */
	set index(value: number) {
		if (this._collection) {
			this._collection.setItemIndex(this, value)
		} else {
			this._index = value
		}
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			index: this.index,
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
	 * Уведомляет коллекцию о том, что элемент изменился.
	 * Коллекция обработает это событие и при необходимости эмитит общую нотификацию.
	 */
	changed(): void {
		if (this._collection) {
			this._collection.itemChanged(this)
		}
	}

	/**
	 * Освобождает ресурсы, отписывается от событий и т.д.
	 * Вызывается перед удалением элемента из коллекции или при явном освобождении.
	 */
	free(): void {
		this._collection = null
	}
}
