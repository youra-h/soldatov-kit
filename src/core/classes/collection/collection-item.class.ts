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
	collection: TCollection | null = null

	/**
	 * Уникальный идентификатор элемента внутри коллекции.
	 */
	id?: number

	private _index: number = -1

	constructor(collection?: TCollection) {
		if (collection) {
			this.collection = collection
		}
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
		if (this.collection) {
			this.collection.setItemIndex(this, value)
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
		if (this.collection) {
			this.collection.itemChanged(this)
		}
	}
}
