import { TCollection } from '../collection.class'
import type {
	IActivatableCollection,
	IActivatableCollectionProps,
	TActivatableCollectionEvents,
	IActivatableCollectionItem,
	IActivatableCollectionItemMeta,
} from './types'
import type { TConstructor } from '../../../../common'
import { TActivatableCollectionItem } from './activable-collection-item.class'
import { isSame } from '../../../../common'
import { TEvented } from '../../../../common'

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

		const prev = this._activeItem
		this._activeItem = item

		// Устанавливаем active только если он еще не установлен
		if (!item.active) {
			item.active = true
		}

		// Деактивируем предыдущий ПОСЛЕ установки нового _activeItem,
		// чтобы change:activation от prev.active = false не вызвал reset()
		if (prev) {
			prev.active = false
		}

		;(this.events as TEvented<TActivatableCollectionEvents>).emit('item:activated', {
			collection: this,
			item,
		})
	}

	/** Очистить активный элемент */
	reset(): void {
		if (this._activeItem) {
			this._activeItem.active = false

			this._activeItem = undefined
			;(this.events as TEvented<TActivatableCollectionEvents>).emit('item:deactivated', {
				collection: this,
			})
		}

		super.reset()
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
	 * Применяет meta-данные (active) к элементу.
	 */
	protected override _assignItemMeta(item: TItem, meta: IActivatableCollectionItemMeta): void {
		if (meta?.active !== undefined) {
			item.active = meta.active
		}
	}

	/**
	 * Переопределяем хук для подписки на события элемента перед assign
	 * @param item Элемент коллекции
	 * @protected
	 */
	protected override _onAfterItemAdd(item: TItem): void {
		this._subscribeItem(item)

		// assign() установил active:true до подписки — запоминаем без эмита событий,
		// но деактивируем предыдущий, чтобы не было двух активных
		if (item.active) {
			const prev = this._activeItem
			this._activeItem = item

			if (prev && !isSame(prev, item)) {
				prev.active = false
			}
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
				this.reset()
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
			const predicate = (this.events as TEvented<TActivatableCollectionEvents>).emitResolve(
				'resolve:_activatablePredicate',
			) as ((item: TItem) => boolean) | undefined

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
