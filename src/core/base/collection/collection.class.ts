import { TEvented } from '../../common/evented'
import type { TCollectionEvents, ICollection, ICollectionProps } from './types'
import { type ICollectionItem } from './item/types'
import type { TConstructor } from '../../common/types'
import { TEntity } from '../../base/entity'

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
export class TCollection<
	TProps extends ICollectionProps = ICollectionProps,
	TEvents extends TCollectionEvents = TCollectionEvents,
	TItem extends ICollectionItem = ICollectionItem,
>
	extends TEntity<TProps>
	implements ICollection<TProps, TEvents, TItem>
{
	/**
	 * Внутренний массив элементов.
	 * @protected
	 */
	protected _items: TItem[] = []

	/**
	 * Конструктор класса элементов, используемый при создании новых элементов.
	 * @protected
	 */
	protected _itemClass: TConstructor<TItem>
	// События
	public readonly events: TEvented<TEvents>

	/**
	 * Создаёт коллекцию, которая будет создавать элементы типа itemClass.
	 * @param options Опции коллекции
	 */
	constructor(options: { itemClass: TConstructor<TItem> }) {
		super()

		this._itemClass = options.itemClass

		this.events = new TEvented<TEvents>()
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
	add(source: Partial<TItem> = {}): TItem {
		const item = new this._itemClass(this)

		// Хук для подписки на события элемента перед assign (для наследников)
		this._onBeforeItemAdd(item)

		item.assign(source as TItem)

		this._items.push(item)

		this.events.emit('added', { collection: this, item })

		return item
	}

	/**
	 * Хук, вызываемый перед assign при добавлении элемента.
	 * Переопределяется в наследниках для подписки на события элемента.
	 * @param item Созданный элемент
	 * @protected
	 */
	protected _onBeforeItemAdd(item: TItem): void {}

	/**
	 * Создаёт и добавляет элементы из массива в конец коллекции.
	 * Каждый элемент массива обрабатывается через метод add(),
	 * что гарантирует корректную работу событий и подписок.
	 * @param sources Массив данных для создания элементов
	 * @returns Массив созданных элементов
	 */
	addFromArray(sources: Partial<TItem>[]): TItem[] {
		return sources.map((source) => this.add(source))
	}

	/**
	 * Возвращает элемент по индексу или undefined, если индекс вне диапазона.
	 * @param index Индекс запрашиваемого элемента.
	 */
	getItem(index: number): TItem | undefined {
		return this._items[index]
	}

	/**
	 * Возвращает индекс элемента в коллекции.
	 * @param item Элемент коллекции
	 * @returns Индекс элемента или -1, если элемент не найден.
	 */
	indexOf(item: TItem): number {
		return this._items.indexOf(item)
	}

	/**
	 * Вставляет новый элемент в позицию index (если index вне диапазона,
	 * корректируется к границам коллекции). Возвращает созданный элемент.
	 * @param index Позиция вставки.
	 */
	insert(index: number): TItem | undefined {
		const item = new this._itemClass(this)

		index = Math.max(0, Math.min(index, this._items.length))

		this.insertAt(item, index)

		return item
	}

	/**
	 * Вставляет элемент по индексу.
	 * @param item Элемент, который нужно вставить
	 * @param index Индекс, по которому нужно вставить элемент
	 * @returns true, если элемент был успешно вставлен, false если не удалось
	 */
	insertAt(item: TItem, index?: number): boolean {
		if (typeof index === 'undefined') {
			index = this._items.length
		}

		if (index < 0 || index > this._items.length) {
			return false
		}

		if (item.collection && item.collection !== this) {
			// Элемент уже в другой коллекции
			return false
		}

		this._items.splice(index, 0, item)
		item.collection = this

		this.events.emit('added', { collection: this, item })

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

		if (
			this.events.emitWithResult('beforeDelete', { collection: this, index, item }) === false
		) {
			return false
		}

		const removed = this._items.splice(index, 1)[0]
		removed?.free()

		this.events.emit('afterDelete', { collection: this, index, item })

		return true
	}

	/**
	 * Удаляет элемент из коллекции.
	 * @param item Элемент для удаления
	 * @returns true, если удаление прошло успешно, иначе false
	 */
	deleteItem(item: TItem): boolean {
		const index = this._items.indexOf(item)

		if (index === -1) {
			return false
		}

		return this.delete(index)
	}

	/**
	 * Полностью очищает коллекцию. Все элементы будут отсоединены.
	 */
	clear(): void {
		this._items.forEach((it) => it.free())
		this._items = []

		this.events.emit('cleared', { collection: this })
	}

	/**
	 * Перемещает существующий элемент item в новую позицию newIndex.
	 * Если элемент не найден, операция игнорируется.
	 * @param item Элемент, который нужно переместить.
	 * @param newIndex Новая позиция элемента.
	 */
	setItemIndex(item: TItem, newIndex: number): void {
		const oldIndex = this._items.indexOf(item)

		if (oldIndex === -1 || oldIndex === newIndex) return

		if (
			this.events.emitWithResult('beforeMove', { collection: this, oldIndex, newIndex }) ===
			false
		) {
			return
		}

		const ni = Math.max(0, Math.min(newIndex, this._items.length - 1))

		if (oldIndex === ni) return

		this._items.splice(oldIndex, 1)
		this._items.splice(ni, 0, item)

		this.events.emit('afterMove', { collection: this, item, oldIndex, newIndex })
	}

	/**
	 * Перемещает элемент из позиции fromIndex в позицию toIndex.
	 * Промежуточная позиция корректируется в пределах допустимого диапазона.
	 * @param fromIndex Исходный индекс.
	 * @param toIndex Целевой индекс.
	 */
	move(fromIndex: number, toIndex: number): void {
		const item = this._items[fromIndex]

		if (!item) return

		this.setItemIndex(item, toIndex)
	}

	/**
	 * Перемещает элемент fromItem в позицию toIndex.
	 * @param fromItem Элемент, который нужно переместить.
	 * @param toIndex Новая позиция элемента.
	 * @returns void
	 */
	moveItem(fromItem: TItem, toIndex: number): void {
		const fromIndex = this._items.indexOf(fromItem)

		if (fromIndex === -1) return

		this.move(fromIndex, toIndex)
	}

	/**
	 * Выполняет функцию fn для каждого элемента коллекции.
	 * @param fn Функция, принимающая элемент и его индекс.
	 */
	forEach(fn: (item: TItem, index: number) => void): void {
		this._items.forEach(fn)
	}

	/**
	 * Возвращает массив элементов коллекции.
	 * Возвращаемый тип параметризуется типом элементов.
	 */
	toArray<T extends TItem>(): T[] {
		return this._items as T[]
	}
}
