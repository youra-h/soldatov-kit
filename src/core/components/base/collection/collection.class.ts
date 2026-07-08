import { TEvented } from '../../../common'
import type { TCollectionEvents, ICollection, ICollectionProps } from './types'
import {
	type ICollectionItem,
	type TCollectionItemSource,
	type ICollectionItemMeta,
} from './item/types'
import type { TConstructor } from '../../../common'
import { TEntity } from '../../base/entity'

/**
 * Коллекция элементов с поддержкой событий и пакетного обновления.
 * @fires changed - Коллекция изменилась (элемент добавлен, удалён, перемещён, обновлён)
 * @fires added - Элемент был добавлен
 * @fires deleted - Элемент был удалён
 * @fires beforeDelete - Элемент будет удалён (можно отменить)
 * @fires afterDelete - Элемент был удалён
 * @fires beforeMove - Элемент будет перемещён (можно отменить)
 * @fires afterMove - Элемент был перемещён
 */
export class TCollection<
		TProps extends ICollectionProps = ICollectionProps,
		TEvents extends TCollectionEvents = TCollectionEvents,
		TItem extends ICollectionItem = ICollectionItem,
	>
	extends TEntity<TProps>
	implements ICollection<TProps, TEvents, TItem>, Iterable<TItem>
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
	 * Возвращает текущий массив элементов коллекции.
	 */
	get items(): TItem[] {
		return this._items
	}

	/**
	 * Заменяет содержимое коллекции: очищает и заполняет из массива данных.
	 */
	setItems<TMeta extends ICollectionItemMeta = ICollectionItemMeta>(
		sources: TCollectionItemSource<TItem, TMeta>[],
	): void {
		this.reset()

		if (sources.length > 0) {
			this.addItems(sources)
		}

		this._notifyItems()
	}

	/**
	 * Обновляет элементы по ключу (без очистки коллекции).
	 * @param sources  Массив source-объектов
	 * @param trackBy  Функция идентификации: (item) => ключ.
	 *                 Элементы с одинаковым ключом обновляются (assign),
	 *                 новые добавляются (add), отсутствующие удаляются (delete).
	 *                 При дублирующихся ключах в source побеждает последний.
	 */
	patchItems<TMeta extends ICollectionItemMeta = ICollectionItemMeta>(
		sources: TCollectionItemSource<TItem, TMeta>[],
		trackBy?: (item: Partial<TItem>) => unknown,
	): void {
		if (!trackBy) return

		// Сопоставляем ключи существующим элементам
		const itemByKey = new Map<unknown, TItem>()

		this._items.forEach((item) => {
			const key = trackBy(item)

			if (key === undefined) {
				throw new Error('patchItems: trackBy вернул undefined для элемента коллекции')
			}

			if (!itemByKey.has(key)) {
				itemByKey.set(key, item)
			}
		})

		// Какие ключи были найдены в source
		const matchedKeys = new Set<unknown>()

		sources.forEach((source) => {
			const key = trackBy(source)

			if (key === undefined) {
				throw new Error('patchItems: trackBy вернул undefined для source')
			}

			const existing = itemByKey.get(key)

			if (existing) {
				// Обновляем существующий элемент (последний source побеждает)
				this._assignItem(existing, source)
				matchedKeys.add(key)
			} else {
				// Добавляем новый элемент
				this.add(source)
			}
		})

		// Удаляем элементы, чьи ключи не были найдены в source
		const toDelete: TItem[] = []

		itemByKey.forEach((item, key) => {
			if (!matchedKeys.has(key)) {
				toDelete.push(item)
			}
		})

		toDelete.forEach((item) => this.deleteItem(item))

		this._notifyItems()
	}

	/**
	 * Создаёт и добавляет элементы в конец коллекции.
	 * Каждый элемент массива обрабатывается через метод add(),
	 * что гарантирует корректную работу событий и подписок.
	 * @param sources Массив данных для создания элементов
	 * @returns Массив созданных элементов
	 */
	addItems<TMeta extends ICollectionItemMeta = ICollectionItemMeta>(
		sources: TCollectionItemSource<TItem, TMeta>[],
	): TItem[] {
		return sources.map((source) => this.add(source))
	}

	/**
	 * Вспомогательный метод, собирает и эмитит общие события коллекции:
	 * 'changed', 'change:items' и опционально 'change:count'.
	 * @param item Опционально — элемент, связанный с изменением.
	 * @param emitCount По умолчанию true — эмитить 'change:count'.
	 * @protected
	 */
	protected _notifyItems(item?: TItem, emitCount = true): void {
		const ev = this.events as TEvented<TCollectionEvents>

		if (item) {
			ev.emit('changed', { collection: this, item })
		}

		ev.emit('change:items', this._items)

		if (emitCount) {
			ev.emit('change:count', this.count)
		}
	}

	/**
	 * Пересчитывает `order` у всех элементов начиная с fromIndex.
	 * Вызывается после любой операции, меняющей позиции элементов.
	 */
	protected _recalculateOrder(fromIndex = 0): void {
		for (let i = fromIndex; i < this._items.length; i++) {
			this._items[i].order = i
		}
	}

	/**
	 * Создаёт новый элемент без добавления в коллекцию.
	 * Используется в add() и patchItems для унификации создания.
	 * @protected
	 */
	protected _createItem(source: Partial<TItem>): TItem {
		const item = new this._itemClass({ collection: this })

		this._assignItem(item, source)

		return item
	}

	/**
	 * Присваивает данные из source элементу.
	 * Разделяет source на props и meta, вызывает assign и хук _assignItemMeta.
	 * @protected
	 */
	protected _assignItem(item: TItem, source: Partial<TItem>): void {
		const { _, ...props } = source as any

		item.assign(props as TItem)

		this._assignItemMeta(item, _ as ICollectionItemMeta)
	}

	/**
	 * Хук для применения meta-данных к элементу.
	 * Переопределяется в TSelectableCollection (selected) и TActivatableCollection (active).
	 * @protected
	 */
	protected _assignItemMeta(item: TItem, meta: ICollectionItemMeta): void {}

	/**
	 * Создаёт и добавляет новый элемент в конец коллекции.
	 * Возвращает созданный элемент.
	 */
	add(source: Partial<TItem> = {}): TItem {
		const item = this._createItem(source)

		this.insertAt(item)

		return item
	}

	/**
	 * Хук, вызываемый перед добавлением элемента в коллекцию.
	 * Вернуть false — отменить добавление.
	 * @param item Элемент для добавления
	 * @protected
	 */
	protected _onBeforeItemAdd(item: TItem): boolean | void {}

	/**
	 * Хук, вызываемый после успешного добавления элемента в коллекцию.
	 * Переопределяется в наследниках для подписки на события элемента
	 * и инициализации начального состояния.
	 * @param item Добавленный элемент
	 * @protected
	 */
	protected _onAfterItemAdd(item: TItem): void {}

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
		return this._items.findIndex((i) => i.uid === item.uid)
	}

	/**
	 * Вставляет новый элемент в позицию index (если index вне диапазона,
	 * корректируется к границам коллекции). Возвращает созданный элемент.
	 * @param index Позиция вставки.
	 */
	insert(index: number): TItem | undefined {
		const item = new this._itemClass({ collection: this })

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

		if (this._onBeforeItemAdd(item) === false) {
			return false
		}

		this._items.splice(index, 0, item)
		item.collection = this

		// После вставки элемента пересчитываем order для всех элементов, начиная с позиции вставки
		this._recalculateOrder(index)
		;(this.events as TEvented<TCollectionEvents>).emit('item:added', { collection: this, item })

		this._onAfterItemAdd(item)

		// Общий сигнал об изменении коллекции
		this._notifyItems(item)

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
			(this.events as TEvented<TCollectionEvents>).emitWithResult('item:beforeDelete', {
				collection: this,
				index,
				item,
			}) === false
		) {
			return false
		}

		const removed = this._items.splice(index, 1)[0]
		removed?.free()

		// После удаления элемента пересчитываем order для всех элементов, начиная с позиции удалённого элемента
		this._recalculateOrder(index)
		;(this.events as TEvented<TCollectionEvents>).emit('item:deleted', {
			collection: this,
			item,
		})
		;(this.events as TEvented<TCollectionEvents>).emit('item:afterDelete', {
			collection: this,
			index,
			item,
		})

		// Общий сигнал об изменении коллекции
		this._notifyItems(item)

		return true
	}

	/**
	 * Удаляет элемент из коллекции.
	 * @param item Элемент для удаления
	 * @returns true, если удаление прошло успешно, иначе false
	 */
	deleteItem(item: TItem): boolean {
		const index = this.indexOf(item)

		if (index === -1) {
			return false
		}

		return this.delete(index)
	}

	/**
	 * Полностью очищает коллекцию. Все элементы будут отсоединены.
	 */
	reset(): void {
		if (!this._items || this._items.length === 0) return

		this._items.forEach((it) => it.free())
		this._items = []

		// Общий сигнал об изменении коллекции
		this._notifyItems()
		;(this.events as TEvented<TCollectionEvents>).emit('reset')
	}

	/**
	 * Перемещает существующий элемент item в новую позицию newIndex.
	 * Если элемент не найден, операция игнорируется.
	 * @param item Элемент, который нужно переместить.
	 * @param newIndex Новая позиция элемента.
	 */
	setItemIndex(item: TItem, newIndex: number): void {
		const oldIndex = this.indexOf(item)

		if (oldIndex === -1 || oldIndex === newIndex) return

		if (
			(this.events as TEvented<TCollectionEvents>).emitWithResult('item:beforeMove', {
				collection: this,
				oldIndex,
				newIndex,
			}) === false
		) {
			return
		}

		const ni = Math.max(0, Math.min(newIndex, this._items.length - 1))

		if (oldIndex === ni) return

		this._items.splice(oldIndex, 1)
		this._items.splice(ni, 0, item)

		// После перемещения элемента пересчитываем order для всех элементов, начиная с позиции min(oldIndex, newIndex)
		this._recalculateOrder(Math.min(oldIndex, ni))
		;(this.events as TEvented<TCollectionEvents>).emit('item:moved', {
			collection: this,
			item,
			oldIndex,
			newIndex: ni,
		})
		;(this.events as TEvented<TCollectionEvents>).emit('item:afterMove', {
			collection: this,
			item,
			oldIndex,
			newIndex: ni,
		})

		// Сигнал об изменении порядка/списка элементов
		this._notifyItems(item, false)
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
		const fromIndex = this.indexOf(fromItem)

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
	 * Возвращает нативный массив элементов-инстансов коллекции.
	 */
	getItems<T extends TItem>(): T[] {
		return this._items as T[]
	}

	[Symbol.iterator](): Iterator<TItem> {
		return this._items[Symbol.iterator]()
	}

	/**
	 * Возвращает первый элемент, удовлетворяющий условию предиката.
	 * Производит линейный поиск по плоскому списку элементов.
	 * @param predicate Функция-условие
	 */
	find(predicate: (item: TItem) => boolean): TItem | undefined {
		return this._items.find(predicate)
	}

	/**
	 * Возвращает первый элемент, у которого значение поля key равно value.
	 * Производит линейный поиск по плоскому списку элементов.
	 * @param key Имя поля
	 * @param value Искомое значение
	 */
	findBy<K extends keyof TItem>(key: K, value: TItem[K]): TItem | undefined {
		return this._items.find((item) => item[key] === value)
	}
}
