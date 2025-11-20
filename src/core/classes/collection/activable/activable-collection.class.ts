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
	clearActive(): void {
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
	private _subscribeItem(item: TItem): void {
		item.events.on('change', (changedItem: TItem) => {
			if (changedItem.active) {
				this.setActive(changedItem)
			} else if (this._activeItem === changedItem) {
				this.clearActive()
			}
		})
	}
}
