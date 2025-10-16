import { TCollection } from './collection.class'
import { TCollectionItem } from './collection-item.class'

export interface ICollectionItem {
	// Ссылка на коллекцию-владелец.
	collection: TCollection | null
	// Уникальный идентификатор элемента внутри коллекции.
	id?: number
	// Текущее положение элемента в коллекции.
	index: number
	// Копирует данные из другого элемента.
	// По умолчанию копирует только id, наследники расширяют логику.
	// @param source Источник данных для копирования.
	assign(source: ICollectionItem): void
	// Вызывает changed() для нотификации коллекции/владельца.
	changed(): void
	// Освобождает ресурсы, отписывается от событий и т.д.
	free(): void
}

/**
 * События, которые эмитит коллекция TCollection.
 */
export type TCollectionEvents = {
	/**
	 * После любой операции, изменившей коллекцию.
	 *
	 * @param payload.collection  Коллекция, в которой произошло изменение.
	 * @param payload.item        Опционально: элемент, который был добавлен, удалён или перемещён.
	 */
	changed: (payload: { collection: TCollection; item?: TCollectionItem }) => void

	/**
	 * После успешного добавления нового элемента.
	 *
	 * @param payload.collection  Коллекция, в которую добавлен элемент.
	 * @param payload.item        Добавленный элемент.
	 */
	added: (payload: { collection: TCollection; item: TCollectionItem }) => void

	/**
	 * Перед удалением элемента.
	 * Если хоть один обработчик вернёт false — удаление отменится.
	 *
	 * @param payload.collection  Коллекция, из которой удаляют элемент.
	 * @param payload.index       Индекс удаляемого элемента.
	 * @param payload.item        Элемент, который будут удалять.
	 * @returns                   false для отмены операции, иначе продолжить.
	 */
	beforeDelete: (payload: {
		collection: TCollection
		index: number
		item: TCollectionItem
	}) => boolean | void

	/**
	 * После удаления элемента.
	 *
	 * @param payload.collection  Коллекция, из которой удалили элемент.
	 * @param payload.index       Индекс, с которого удалили элемент.
	 * @param payload.item        Удалённый элемент.
	 */
	afterDelete: (payload: {
		collection: TCollection
		index: number
		item: TCollectionItem
	}) => void

	/**
	 * После очистки коллекции.
	 *
	 * @param payload.collection  Коллекция, которая была очищена.
	 */
	cleared: (payload: { collection: TCollection }) => void

	/**
	 * Перед перемещением элемента.
	 * Если хоть один обработчик вернёт false — перемещение отменится.
	 *
	 * @param payload.collection  Коллекция, в которой перемещают элемент.
	 * @param payload.oldIndex    Исходный индекс элемента.
	 * @param payload.newIndex    Новый индекс для элемента.
	 * @returns                   false для отмены операции, иначе продолжить.
	 */
	beforeMove: (payload: {
		collection: TCollection
		oldIndex: number
		newIndex: number
	}) => boolean | void

	/**
	 * После перемещения элемента.
	 *
	 * @param payload.collection  Коллекция, в которой переместили элемент.
	 * @param payload.item        Перемещённый элемент.
	 * @param payload.oldIndex    Исходный исходный индекс.
	 * @param payload.newIndex    Индекс, на который элемент переместился.
	 */
	afterMove: (payload: {
		collection: TCollection
		item: TCollectionItem
		oldIndex: number
		newIndex: number
	}) => void
}

/**
 * Базовый интерфейс коллекции элементов.
 * Определяет контракт, который должны реализовывать все коллекции.
 */
export interface ICollection<TItem extends TCollectionItem = TCollectionItem> {
	/** Количество элементов в коллекции */
	readonly count: number

	/** Добавляет новый элемент и возвращает его */
	add(): TItem | undefined

	/**
	 * Вставляет новый элемент по индексу
	 * @param index Индекс вставки
	 */
	insert(index: number): TItem | undefined

	/**
	 * Вставляет существующий элемент по индексу
	 * @param item Элемент для вставки
	 * @param index Индекс вставки
	 */
	insertAt(item: TItem, index?: number): boolean

	/**
	 * Удаляет элемент по индексу
	 * @param index Индекс удаляемого элемента
	 * @returns true, если удаление прошло успешно
	 */
	delete(index: number): boolean

	/** Полностью очищает коллекцию */
	clear(): void

	/**
	 * Возвращает элемент по индексу
	 * @param index Индекс элемента
	 */
	getItem(index: number): TItem | undefined

	/**
	 * Перемещает элемент в новую позицию
	 * @param item Элемент
	 * @param newIndex Новый индекс
	 */
	setItemIndex(item: TItem, newIndex: number): void

	/**
	 * Перемещает элемент из позиции fromIndex в позицию toIndex
	 */
	move(fromIndex: number, toIndex: number): void

	/** Начало пакетного обновления */
	beginUpdate(): void

	/** Конец пакетного обновления */
	endUpdate(): void

	/** Перебор элементов */
	forEach(fn: (item: TItem, idx: number) => void): void

	/** Возвращает массив элементов */
	toArray(): TItem[]
}

export interface IEventedCollection<TItem extends TCollectionItem> extends ICollection<TItem> {
	on<K extends keyof TCollectionEvents>(event: K, handler: TCollectionEvents[K]): void

	off<K extends keyof TCollectionEvents>(event: K, handler: TCollectionEvents[K]): void
}
