// collection.class.ts
import { TEvented } from '../evented'
import type { TCollectionEvents } from './types'
import { TCollectionItem } from './collection-item.class'
import type { TConstructor } from '../../common/types'

/**
 * Коллекция элементов с поддержкой событий и пакетного обновления.
 */
export class TCollection extends TEvented<TCollectionEvents> {
	/**
	 * Внутренний массив элементов.
	 * @protected
	 */
	protected _items: TCollectionItem[] = []

	/**
	 * Конструктор класса элементов, используемый при создании новых элементов.
	 * @protected
	 */
	protected _itemClass: TConstructor<TCollectionItem>

	/**
	 * Счётчик вложенных вызовов beginUpdate/endUpdate.
	 * @protected
	 */
	protected _updateCount = 0

	/**
	 * Счётчик для генерации id элементов.
	 * @protected
	 */
	protected _nextId = 1

	/**
	 * Владелец коллекции (например, компонент).
	 */
	owner: any = null

	/**
	 * Создаёт коллекцию, которая будет создавать элементы типа itemClass.
	 * @param itemClass Класс элементов коллекции.
	 */
	constructor(itemClass: TConstructor<TCollectionItem>) {
		super()

		this._itemClass = itemClass
	}

	/**
	 * Количество элементов в коллекции.
	 */
	get count(): number {
		return this._items.length
	}

	/**
	 * Создаёт и добавляет новый элемент в конец коллекции.
	 * Возвращает созданный элемент.
	 */
	add(): TCollectionItem {
		const item = new this._itemClass(this)
		item.id = item.id ?? this._nextId++

		this._items.push(item)
		item._updateIndex(this._items.length - 1)

		this.reindex()
		this.notifyChange(item)

		return item
	}

	/**
	 * Вставляет новый элемент в позицию index (если index вне диапазона,
	 * корректируется к границам коллекции). Возвращает созданный элемент.
	 * @param index Позиция вставки.
	 */
	insert(index: number): TCollectionItem {
		const item = new this._itemClass(this)
		item.id = this._nextId++

		const i = Math.max(0, Math.min(index, this._items.length))
		this._items.splice(i, 0, item)

		this.reindex()
		this.notifyChange(item)

		return item
	}

	/**
	 * Удаляет элемент по индексу, если он существует.
	 * Удалённый элемент отсоединяется от коллекции.
	 * @param index Индекс удаляемого элемента.
	 */
	delete(index: number): void {
		if (index < 0 || index >= this._items.length) return

		const removed = this._items.splice(index, 1)[0]
		removed.collection = null

		this.reindex()
		this.notifyChange(removed)
	}

	/**
	 * Полностью очищает коллекцию. Все элементы будут отсоединены.
	 */
	clear(): void {
		this._items.forEach((it) => (it.collection = null))
		this._items = []

		this.reindex()
		this.notifyChange(undefined)
	}

	/**
	 * Возвращает элемент по индексу или undefined, если индекс вне диапазона.
	 * @param index Индекс запрашиваемого элемента.
	 */
	getItem(index: number): TCollectionItem | undefined {
		return this._items[index]
	}

	/**
	 * Перемещает существующий элемент item в новую позицию newIndex.
	 * Если элемент не найден, операция игнорируется.
	 * @param item Элемент, который нужно переместить.
	 * @param newIndex Новая позиция элемента.
	 */
	setItemIndex(item: TCollectionItem, newIndex: number): void {
		const old = this._items.indexOf(item)

		if (old === -1) return

		const ni = Math.max(0, Math.min(newIndex, this._items.length - 1))

		if (old === ni) return

		this._items.splice(old, 1)
		this._items.splice(ni, 0, item)

		this.reindex()
		this.notifyChange(item)
	}

	/**
	 * Перемещает элемент из позиции fromIndex в позицию toIndex.
	 * Промежуточная позиция корректируется в пределах допустимого диапазона.
	 * @param fromIndex Исходный индекс.
	 * @param toIndex Целевой индекс.
	 */
	move(fromIndex: number, toIndex: number): void {
		if (fromIndex === toIndex) return

		const item = this._items.splice(fromIndex, 1)[0]

		if (!item) return

		const ti = Math.max(0, Math.min(toIndex, this._items.length))
		this._items.splice(ti, 0, item)

		this.reindex()
		this.notifyChange(item)
	}

	/**
	 * Начало пакетного обновления. Увеличивает счётчик обновления.
	 * Во время пакетного обновления уведомления откладываются до вызова endUpdate.
	 */
	beginUpdate(): void {
		this._updateCount++
	}

	/**
	 * Конец пакетного обновления. Уменьшает счётчик и при достижении нуля
	 * отправляет единое уведомление об изменениях.
	 */
	endUpdate(): void {
		if (this._updateCount > 0) {
			this._updateCount--
		}

		if (this._updateCount === 0) {
			this.notifyChange(undefined)
		}
	}

	/**
	 * Пересчитывает индексы всех элементов коллекции.
	 * Этот метод вызывается автоматически после изменений структуры коллекции.
	 * @protected
	 */
	protected reindex(): void {
		for (let i = 0; i < this._items.length; i++) {
			;(this._items[i] as any)._updateIndex(i)
		}
	}

	/**
	 * Отправляет событие изменения коллекции, если пакетное обновление не активно.
	 * Эмитит событие 'changed' с коллекцией и опционально с конкретным элементом.
	 * @param item Опционально: элемент, который изменился.
	 * @protected
	 */
	protected notifyChange(item?: TCollectionItem): void {
		if (this._updateCount > 0) return

		this.emit('changed', this, item)
	}

	/**
	 * Вызывается элементом коллекции, чтобы сообщить о локальном изменении.
	 * Коллекция обработает событие и при необходимости эметит внешнее уведомление.
	 * @param item Элемент, который изменился.
	 */
	itemChanged(item: TCollectionItem): void {
		this.notifyChange(item)
	}

	/**
	 * Выполняет функцию fn для каждого элемента коллекции.
	 * @param fn Функция, принимающая элемент и его индекс.
	 */
	forEach(fn: (item: TCollectionItem, idx: number) => void): void {
		this._items.forEach(fn)
	}

	/**
	 * Возвращает массив элементов коллекции.
	 * Возвращаемый тип параметризуется типом элементов.
	 */
	toArray<T extends TCollectionItem>(): T[] {
		return this._items as T[]
	}
}
