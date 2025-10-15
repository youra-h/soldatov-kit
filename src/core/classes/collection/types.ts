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
	 * Перед добавлением нового элемента.
	 * Если хоть один обработчик вернёт false — добавление отменится.
	 *
	 * @param payload.collection  Коллекция, в которую собираются добавить элемент.
	 * @returns                   false для отмены операции, иначе продолжить.
	 */
	beforeAdd: (payload: { collection: TCollection }) => boolean | void

	/**
	 * После успешного добавления нового элемента.
	 *
	 * @param payload.collection  Коллекция, в которую добавлен элемент.
	 * @param payload.item        Добавленный элемент.
	 */
	afterAdd: (payload: { collection: TCollection; item: TCollectionItem }) => void

	/**
	 * Перед вставкой элемента по индексу.
	 * Если хоть один обработчик вернёт false — вставка отменится.
	 *
	 * @param payload.collection  Коллекция, в которую будет вставлен элемент.
	 * @param payload.index       Индекс, на который будет вставлен элемент.
	 * @returns                   false для отмены операции, иначе продолжить.
	 */
	beforeInsert: (payload: { collection: TCollection; index: number }) => boolean | void

	/**
	 * После успешной вставки элемента по индексу.
	 *
	 * @param payload.collection  Коллекция, в которую вставлен элемент.
	 * @param payload.item        Вставленный элемент.
	 * @param payload.index       Индекс, на котором элемент оказался после вставки.
	 */
	afterInsert: (payload: {
		collection: TCollection
		item: TCollectionItem
		index: number
	}) => void

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
	 * Перед очисткой всей коллекции.
	 * Если хоть один обработчик вернёт false — очистка отменится.
	 *
	 * @param payload.collection  Коллекция, которую собираются очистить.
	 * @returns                   false для отмены операции, иначе продолжить.
	 */
	beforeClear: (payload: { collection: TCollection }) => boolean | void

	/**
	 * После очистки коллекции.
	 *
	 * @param payload.collection  Коллекция, которая была очищена.
	 */
	afterClear: (payload: { collection: TCollection }) => void

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
