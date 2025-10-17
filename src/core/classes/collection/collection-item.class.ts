import { TCollection } from './collection.class'
import type { ICollectionItem } from './types'

/**
 * Элемент коллекции.
 */
export class TCollectionItem implements ICollectionItem {
	/**
	 * Ссылка на коллекцию-владелец.
	 * @readonly
	 */
	private _collection: TCollection | null = null

	/**
	 * Уникальный идентификатор элемента внутри коллекции.
	 */
	id?: number | string

	private _index: number = -1

	constructor(collection?: TCollection) {
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

	/**
	 * @internal
	 * Внутренний метод: прямая установка индекса без вызова логики перемещения.
	 * Используется коллекцией для реиндексации элементов.
	 * @param value Новый индекс.
	 */
	_updateIndex(value: number): void {
		this._index = value
	}

	/**
	 * Копирует данные из другого элемента.
	 * По умолчанию копирует только id, наследники расширяют логику.
	 * @param source Источник данных для копирования.
	 */
	assign(source: TCollectionItem): void {
		if (!source) return

		this.id = source.id
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
