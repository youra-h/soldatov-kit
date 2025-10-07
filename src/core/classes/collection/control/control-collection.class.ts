import { TCollectionOwned } from '../collection-owned.class'
import type { TConstructor } from '../../../common/types'
import { AbstractControlItem } from './control-item.class'
import { TControl } from '../../control'
import { TCollectionItem } from '../collection-item.class'

/**
 * Универсальная коллекция для любых UI-контролов.
 * Поддерживает типобезопасное создание и перебор элементов.
 */
export class ControlCollection<
	TItem extends AbstractControlItem<TControlType>,
	TControlType extends TControl<any> = TControl<any>,
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
	addItem(): TItem {
		return this.add() as TItem
	}

	/**
	 * Создаёт элемент и задаёт свойства.
	 * @param props Частичный набор свойств элемента
	 */
	addItemWith(props: Partial<TItem>): TItem {
		const item = this.addItem()
		item.assign(Object.assign(new this._itemCtor(), props))
		return item
	}

	/**
	 * Пробегает элементы с типом TItem.
	 * @param fn функция-обработчик
	 */
	forEachItem(fn: (item: TItem, idx: number) => void): void {
		this.forEach(fn as any)
	}

	/**
	 * Возвращает массив элементов с корректным типом.
	 */
	toArray<T extends TCollectionItem = TItem>(): T[] {
		return super.toArray<T>()
	}
}
