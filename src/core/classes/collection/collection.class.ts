import { TEvented } from '../evented'
import type { TCollectionEvents } from './types'
import { TCollectionItem } from './collection-item.class'
import type { TConstructor } from '../../common/types'

/**
 * Коллекция элементов с поддержкой событий и пакетного обновления.
 * @fires changed - Коллекция изменилась (элемент добавлен, удалён, перемещён, обновлён)
 * @fires added - Элемент был добавлен
 * @fires beforeDelete - Элемент будет удалён (можно отменить)
 * @fires afterDelete - Элемент был удалён
 * @fires cleared - Коллекция была очищена
 * @fires beforeMove - Элемент будет перемещён (можно отменить)
 * @fires afterMove - Элемент был перемещён
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
		this.reindex()

		this.emit('added', { collection: this, item })
		this.notifyChange(item)

		return item
	}

	/**
	 * Вставляет новый элемент в позицию index (если index вне диапазона,
	 * корректируется к границам коллекции). Возвращает созданный элемент.
	 * @param index Позиция вставки.
	 */
	insert(index: number): TCollectionItem | undefined {
		const item = new this._itemClass(this)
		item.id = this._nextId++

		index = Math.max(0, Math.min(index, this._items.length))

		this.insertAt(index, item)

		return item
	}

	/**
	 * Вставляет элемент по индексу.
	 * @param index Индекс, по которому нужно вставить элемент
	 * @param item Элемент, который нужно вставить
	 * @returns true, если элемент был успешно вставлен, false если не удалось
	 */
	insertAt(index: number, item: TCollectionItem): boolean {
		if (index < 0 || index > this._items.length) {
			return false
		}

		if (item.collection) {
			// Элемент уже в другой коллекции
			return false
		}

		this._items.splice(index, 0, item)
		item.collection = this
		item.id = item.id ?? this._nextId++

		this.reindex()

		this.emit('added', { collection: this, item })
		this.notifyChange(item)

		return true
	}

	/**
	 * Удаляет элемент по индексу, если он существует.
	 * Удалённый элемент отсоединяется от коллекции.
	 * @param index Индекс удаляемого элемента.
	 * @return true, если элемент был удалён, false если индекс вне диапазона.
	 */
	delete(index: number): boolean {
		if (index < 0 || index >= this._items.length) {
			return false
		}

		const item = this._items[index]

		if (this.emitWithResult('beforeDelete', { collection: this, index, item }) === false) {
			return false
		}

		const removed = this._items.splice(index, 1)[0]
		removed.free()

		this.reindex()

		this.emit('afterDelete', { collection: this, index, item })
		this.notifyChange(removed)

		return true
	}

	/**
	 * Полностью очищает коллекцию. Все элементы будут отсоединены.
	 */
	clear(): void {
		this._items.forEach((it) => it.free())
		this._items = []

		this.reindex()

		this.emit('cleared', { collection: this })
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
		const oldIndex = this._items.indexOf(item)

		if (oldIndex === -1 || oldIndex === newIndex) return

		if (this.emitWithResult('beforeMove', { collection: this, oldIndex, newIndex }) === false) {
			return
		}

		const ni = Math.max(0, Math.min(newIndex, this._items.length - 1))

		if (oldIndex === ni) return

		this._items.splice(oldIndex, 1)
		this._items.splice(ni, 0, item)

		this.reindex()

		this.emit('afterMove', { collection: this, item, oldIndex, newIndex })
		this.notifyChange(item)
	}

	/**
	 * Перемещает элемент из позиции fromIndex в позицию toIndex.
	 * Промежуточная позиция корректируется в пределах допустимого диапазона.
	 * @param fromIndex Исходный индекс.
	 * @param toIndex Целевой индекс.
	 */
	move(fromIndex: number, toIndex: number): void {
		const item = this._items[fromIndex]
		this.setItemIndex(item, toIndex)
	}

	/**
	 * Перемещает элемент fromItem в позицию toIndex.
	 * @param fromItem Элемент, который нужно переместить.
	 * @param toIndex Новая позиция элемента.
	 * @returns void
	 */
	moveItem(fromItem: TCollectionItem, toIndex: number): void {
		const fromIndex = this._items.indexOf(fromItem)

		if (fromIndex === -1) return

		this.move(fromIndex, toIndex)
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
			;(this._items[i] as TCollectionItem)._updateIndex(i)
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

		this.emit('changed', { collection: this, item })
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
