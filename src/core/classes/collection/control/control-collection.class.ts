import { TCollectionOwned } from '../collection-owned.class'
import { TCollectionItem } from '../collection-item.class'
import type { TConstructor } from '../../../common/types'
import { AbstractControlItem } from './control-item.class'
import { TControl } from '../../control'

/**
 * Универсальная коллекция для любых UI-контролов.
 * Поддерживает типобезопасное создание и перебор элементов.
 */
export class TControlCollection<
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
	 * Вставляет элемент по индексу.
	 * @param index Индекс, по которому нужно вставить элемент
	 * @returns Вставленный элемент типа TItem
	 */
	insertItem(index: number): TItem {
		return this.insert(index) as TItem
	}

	/**
	 * Удаляет элемент по имени, если он существует.
	 * @param name имя элемента
	 * @returns true, если элемент был удалён, false если не найдено
	 */
	deleteByName(name: string): boolean {
		const idx = this._items.findIndex((it) => (it as TItem).name === name)

		if (idx === -1) return false

		return this.delete(idx)
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
