import { TCollection } from '../collection.class'
import type {
	IActivatableCollection,
	IActivatableCollectionProps,
	TActivatableCollectionEvents,
	IActivatableCollectionItem,
} from './types'
import type { TConstructor } from '../../../common/types'
import { TActivatableCollectionItem } from './activable-collection-item.class'

/**
 * Коллекция элементов с поддержкой активности.
 */
export class TActivatableCollection<
		TProps extends IActivatableCollectionProps = IActivatableCollectionProps,
		TEvents extends TActivatableCollectionEvents = TActivatableCollectionEvents,
		TItem extends IActivatableCollectionItem = IActivatableCollectionItem,
	>
	extends TCollection<TProps, TEvents, TItem>
	implements IActivatableCollection<TProps, TEvents, TItem>
{
	private _activeItem?: TItem

	constructor(options?: { itemClass?: TConstructor<TItem> }) {
		super({
			itemClass: (options?.itemClass ?? TActivatableCollectionItem) as TConstructor<TItem>,
		})
	}

	get activeItem(): TItem | undefined {
		return this._activeItem
	}

	/**
	 * Установить активный элемент
	 * @param item Элемент, который должен стать активным
	 */
	setActive(item: TItem): void {
		if (this._activeItem && this._activeItem !== item) {
			this._activeItem.active = false
		}
		this._activeItem = item

		item.active = true

		this.events.emit('change', { collection: this, item })
	}

	/** Очистить активный элемент */
	clear(): void {
		if (this._activeItem) {
			this._activeItem.active = false

			this._activeItem = undefined

			this.events.emit('change', { collection: this, item: undefined })
		}
	}

	/**
	 * Переопределяем add, чтобы подписаться на события элемента
	 * @param source Частичные данные для создания элемента
	 */
	add(source: Partial<TItem> = {}): TItem {
		const item = super.add(source)

		this._subscribeItem(item)

		return item
	}

	/**
	 * Подписываемся на события элемента
	 * @param item Элемент коллекции
	 */
	protected _subscribeItem(item: TItem): void {
		item.events.on('change', (changedItem: TItem) => {
			if (changedItem.active) {
				this.setActive(changedItem)
			} else if (this._activeItem === changedItem) {
				this.clear()
			}
		})
	}

	/**
	 * Переопределяем delete, чтобы автоматически активировать следующий элемент
	 * после удаления активного элемента.
	 * @param index Индекс удаляемого элемента
	 * @returns true, если элемент был удалён, false если индекс вне диапазона
	 */
	override delete(index: number): boolean {
		if (index < 0 || index >= this.count) {
			return false
		}

		const item = this.getItem(index)
		const wasActive = this._activeItem === item

		// Если удаляется активный элемент и в коллекции есть другие элементы,
		// активируем соседний элемент ДО удаления
		if (wasActive && this.count > 1) {
			// Выбираем следующий элемент, если он есть, иначе предыдущий
			const newIndex = index < this.count - 1 ? index + 1 : index - 1
			const newActiveItem = this.getItem(newIndex)

			if (newActiveItem) {
				this.setActive(newActiveItem)
			}
		}

		// Вызываем родительский метод delete
		const result = super.delete(index)

		// Если удалён последний активный элемент, очищаем активность
		if (result && wasActive && this.count === 0) {
			this._activeItem = undefined
		}

		return result
	}

	/**
	 * Переопределяем deleteItem, чтобы автоматически активировать следующий элемент
	 * после удаления активного элемента.
	 * @param item Элемент для удаления
	 * @returns true, если удаление прошло успешно, иначе false
	 */
	override deleteItem(item: TItem): boolean {
		const index = this.indexOf(item)

		if (index === -1) {
			return false
		}

		return this.delete(index)
	}
}
