import {
	type ICollectionItem,
	type TCollectionItemSource,
	type ICollectionItemMeta,
} from './item/types'
import type { IEntity } from '../../base/entity'
import { TEvented } from '../../../common'

/**
 * Базовый интерфейс коллекции элементов.
 * Определяет контракт, который должны реализовывать все коллекции.
 */
export interface ICollectionProps<
	TItem extends ICollectionItem = ICollectionItem,
	TMeta extends ICollectionItemMeta = ICollectionItemMeta,
> {
	/**
	 * Данные для наполнения коллекции через addItems/patchItems.
	 * При установке коллекция очищается и заполняется из этого массива.
	 * Поддерживает мета-поле _ для передачи состояний (selected, active и т.д.).
	 */
	items?: TCollectionItemSource<TItem, TMeta>[]
}

/**
 * Внешний контракт синхронизации: данные для наполнения коллекции
 * и опциональная функция идентификации для умного обновления (patchItems).
 * Не является частью TCollection — используется только на уровне представления.
 */
export interface ICollectionSource<
	TItem extends ICollectionItem = ICollectionItem,
	TMeta extends ICollectionItemMeta = ICollectionItemMeta,
> extends ICollectionProps<TItem, TMeta> {
	/** Функция идентификации: (item) => ключ. Используется внутри patchItems. */
	trackBy?: (item: Partial<TItem>) => unknown
}

/**
 * События, которые эмитит коллекция TCollection.
 */
export type TCollectionEvents<TItem extends ICollectionItem = ICollectionItem> = {
	/**
	 * После любой операции, изменившей коллекцию.
	 *
	 * @param payload.collection  Коллекция, в которой произошло изменение.
	 * @param payload.item        Опционально: элемент, который был добавлен, удалён или перемещён.
	 */
	/**
	 * Устаревшее/общее событие изменения коллекции.
	 * Вызывается после операций добавления/удаления/перемещения/очистки.
	 */
	changed: (payload: { collection: ICollection; item?: TItem }) => void

	/**
	 * После изменения списка элементов (items). Передаётся актуальный массив элементов.
	 */
	'change:items': (items: TItem[]) => void

	/**
	 * После изменения количества элементов в коллекции.
	 */
	'change:count': (count: number) => void

	/** Сброс состояния коллекции (очистка, удаление всех элементов) */
	reset: () => void

	/**
	 * После успешного добавления нового элемента.
	 *
	 * @param payload.collection  Коллекция, в которую добавлен элемент.
	 * @param payload.item        Добавленный элемент.
	 */
	'item:added': (payload: { collection: ICollection; item: TItem }) => void

	/**
	 * Перед удалением элемента.
	 * Если хоть один обработчик вернёт false — удаление отменится.
	 *
	 * @param payload.collection  Коллекция, из которой удаляют элемент.
	 * @param payload.index       Индекс удаляемого элемента.
	 * @param payload.item        Элемент, который будут удалять.
	 * @returns                   false для отмены операции, иначе продолжить.
	 */
	'item:beforeDelete': (payload: {
		collection: ICollection
		index: number
		item: TItem
	}) => boolean | void

	/**
	 * После удаления элемента.
	 *
	 * @param payload.collection  Коллекция, из которой удалён элемент.
	 * @param payload.item        Удалённый элемент.
	 */
	'item:deleted': (payload: { collection: ICollection; item: TItem }) => void

	/**
	 * После удаления элемента.
	 *
	 * @param payload.collection  Коллекция, из которой удалили элемент.
	 * @param payload.index       Индекс, с которого удалили элемент.
	 * @param payload.item        Удалённый элемент.
	 */
	'item:afterDelete': (payload: { collection: ICollection; index: number; item: TItem }) => void

	/**
	 * Перед перемещением элемента.
	 * Если хоть один обработчик вернёт false — перемещение отменится.
	 *
	 * @param payload.collection  Коллекция, в которой перемещают элемент.
	 * @param payload.oldIndex    Исходный индекс элемента.
	 * @param payload.newIndex    Новый индекс для элемента.
	 * @returns                   false для отмены операции, иначе продолжить.
	 */
	'item:beforeMove': (payload: {
		collection: ICollection
		oldIndex: number
		newIndex: number
	}) => boolean | void

	'item:moved': (payload: {
		collection: ICollection
		item: TItem
		oldIndex: number
		newIndex: number
	}) => void

	/**
	 * После перемещения элемента.
	 *
	 * @param payload.collection  Коллекция, в которой переместили элемент.
	 * @param payload.item        Перемещённый элемент.
	 * @param payload.oldIndex    Исходный исходный индекс.
	 * @param payload.newIndex    Индекс, на который элемент переместился.
	 */
	'item:afterMove': (payload: {
		collection: ICollection
		item: TItem
		oldIndex: number
		newIndex: number
	}) => void
}

/**
 * Общие события для компонентов, содержащих коллекцию элементов.
 * Описывают проброс изменений свойств элементов наружу (к родительскому компоненту).
 */
export type TItemProxyEvents<TItem> = {
	/** item:disabled — эмитится при изменении свойства disabled у элемента */
	'item:disabled': (item: TItem, value: boolean) => void
}

export interface ICollectionMethods<TItem extends ICollectionItem = ICollectionItem> {
	/** Заменяет содержимое коллекции: очищает и заполняет из массива данных */
	setItems<TMeta extends ICollectionItemMeta = ICollectionItemMeta>(
		sources: TCollectionItemSource<TItem, TMeta>[],
	): void

	/**
	 * Обновляет элементы по ключу (без очистки коллекции).
	 * @param trackBy Функция идентификации: (item) => ключ
	 */
	patchItems<TMeta extends ICollectionItemMeta = ICollectionItemMeta>(
		sources: TCollectionItemSource<TItem, TMeta>[],
		trackBy?: (item: Partial<TItem>) => unknown,
	): void

	/** Добавляет новый элемент и возвращает его */
	add(source?: Partial<TItem>): TItem

	/**
	 * Добавляет элементы в конец коллекции и возвращает массив созданных элементов
	 * @param sources Массив данных для создания элементов
	 */
	addItems<TMeta extends ICollectionItemMeta = ICollectionItemMeta>(
		sources: TCollectionItemSource<TItem, TMeta>[],
	): TItem[]

	/**
	 * Вернуть индекс элемента
	 * @param item Элемент коллекции
	 */
	indexOf(item: TItem): number

	/**
	 * Возвращает элемент по индексу
	 * @param index Индекс элемента
	 */
	getItem(index: number): TItem | undefined

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

	/**
	 * Удаляет элемент
	 * @param item Элемент для удаления
	 * @returns true, если удаление прошло успешно
	 */
	deleteItem(item: TItem): boolean

	/** Полностью очищает коллекцию */
	reset(): void

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

	/** Перебор элементов */
	forEach(fn: (item: TItem, index: number) => void): void

	/** Возвращает нативный массив элементов-инстансов */
	getItems(): TItem[]

	/**
	 * Текущие элементы коллекции.
	 * Getter возвращает массив инстансов.
	 * Setter очищает коллекцию и заполняет из нового массива данных.
	 */
	get items(): TItem[]

	/**
	 * Возвращает первый элемент, удовлетворяющий условию предиката.
	 * @param predicate Функция-условие
	 */
	find(predicate: (item: TItem) => boolean): TItem | undefined

	/**
	 * Возвращает первый элемент, у которого значение поля key равно value.
	 * @param key Имя поля
	 * @param value Искомое значение
	 */
	findBy<K extends keyof TItem>(key: K, value: TItem[K]): TItem | undefined
}

export interface ICollection<
	TProps extends ICollectionProps = ICollectionProps,
	TEvents extends TCollectionEvents = TCollectionEvents,
	TItem extends ICollectionItem = ICollectionItem,
> extends IEntity<TProps>,
		ICollectionMethods<TItem> {
	readonly events: TEvented<TEvents>
	/** Текущие элементы коллекции */
	readonly items: TItem[]
	/** Количество элементов в коллекции */
	readonly count: number
}
