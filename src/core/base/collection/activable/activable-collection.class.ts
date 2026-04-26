import { TCollection } from '../collection.class'
import type {
	IActivatableCollection,
	IActivatableCollectionProps,
	TActivatableCollectionEvents,
	IActivatableCollectionItem,
} from './types'
import type { TConstructor } from '../../../common/types'
import { TActivatableCollectionItem } from './activable-collection-item.class'
import { isSame } from '../../../common/is-same'

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
		// Если элемент уже активен, ничего не делаем
		if (isSame(this._activeItem, item)) {
			return
		}

		if (this._activeItem) {
			this._activeItem.active = false
		}

		this._activeItem = item

		// Устанавливаем active только если он еще не установлен
		if (!item.active) {
			item.active = true
		}

		this.events.emit('item:activated', { collection: this, item })
	}

	/** Очистить активный элемент */
	clear(): void {
		if (this._activeItem) {
			this._activeItem.active = false

			this._activeItem = undefined

			this.events.emit('item:deactivated', { collection: this })
		}
	}

	/**
	 * Найти первый подходящий элемент для активации.
	 * Поиск идёт сначала вперёд от fromItem (следующий, следующий+1…), затем назад.
	 * @param predicate Условие отбора (опционально — без условия подходит любой)
	 * @param fromItem  Элемент-ориентир для поиска (опционально)
	 */
	findActivatable(predicate?: (item: TItem) => boolean, fromItem?: TItem): TItem | undefined {
		const check = predicate ?? (() => true)
		const fromIndex = fromItem !== undefined ? this.indexOf(fromItem) : -1

		// Сначала вперёд: fromIndex+1, fromIndex+2, ...
		for (let i = fromIndex + 1; i < this.count; i++) {
			const item = this.getItem(i)
			if (item && check(item)) return item
		}

		// Затем назад: fromIndex-1, fromIndex-2, ...
		for (let i = fromIndex - 1; i >= 0; i--) {
			const item = this.getItem(i)
			if (item && check(item)) return item
		}

		return undefined
	}

	/**
	 * Переопределяем хук для подписки на события элемента перед assign
	 * @param item Элемент коллекции
	 * @protected
	 */
	protected override _onAfterItemAdd(item: TItem): void {
		this._subscribeItem(item)

		// assign() установил active:true до подписки — обрабатываем начальное состояние явно
		if (item.active) {
			this.setActive(item)
		}
	}

	/**
	 * Подписываемся на события элемента
	 * @param item Элемент коллекции
	 */
	protected _subscribeItem(item: TItem): void {
		item.events.on('change:activation', (changedItem: TItem) => {
			if (changedItem.active && !isSame(this._activeItem, changedItem)) {
				this.setActive(changedItem)
			} else if (!changedItem.active && isSame(this._activeItem, changedItem)) {
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
		const wasActive = isSame(this._activeItem, item)
		let newActiveItem: TItem | undefined

		// Если удаляется активный элемент и в коллекции есть другие элементы,
		// запрашиваем предикат через событие и активируем подходящий элемент ДО удаления
		if (wasActive && this.count > 1) {
			// Запрашиваем предикат для поиска следующего активного элемента
			const predicate = this.events.emitResolve<(item: TItem) => boolean>('resolve:_activatablePredicate')

			newActiveItem = this.findActivatable(predicate, item)

			if (newActiveItem) {
				this.setActive(newActiveItem)
			}
		}

		// Вызываем родительский метод delete
		const result = super.delete(index)

		// Если удалён последний активный элемент, очищаем активность
		if (result && wasActive && (this.count === 0 || !newActiveItem)) {
			this._activeItem = undefined
		}

		return result
	}
}
