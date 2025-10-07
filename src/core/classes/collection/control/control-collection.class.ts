import { TCollectionOwned } from '../collection-owned.class'
import type { TConstructor } from '../../../common/types'
import { AbstractControlItem } from './control-item.class'

/**
 * Абстрактная коллекция для UI-контролов.
 * Предоставляет фабричный метод addControl и типобезопасные toArray/forEach.
 */
export abstract class AbstractControlCollection<
	TItem extends AbstractControlItem,
> extends TCollectionOwned {
	protected _itemCtor: TConstructor<TItem>

	constructor(owner: any, itemClass: TConstructor<TItem>) {
		super(owner, itemClass)
		this._itemCtor = itemClass
	}

	/**
	 * Создаёт и добавляет элемент в коллекцию.
	 * @returns созданный элемент типа TItem
	 */
	addControl(): TItem {
		return this.add() as TItem
	}

	/**
	 * Пробегает элементы с типом TItem.
	 * @param fn функция-обработчик
	 */
	forEachControl(fn: (item: TItem, idx: number) => void): void {
		this.forEach(fn as any)
	}

	/**
	 * Возвращает массив элементов с корректным типом.
	 */
	toArrayControls(): TItem[] {
		return this.toArray<TItem>()
	}
}
