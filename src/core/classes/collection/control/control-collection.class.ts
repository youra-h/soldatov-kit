import { TCollectionOwned } from '../collection-owned.class'
import { TCollectionItem } from '../item/collection-item.class'
import type { TConstructor } from '../../../common/types'
import { AbstractControlItem } from './control-item.class'
import { TControl } from '../../control'

export const defaultValues = {
	disabled: false,
}

/**
 * Универсальная коллекция для любых UI-контролов.
 * Поддерживает типобезопасное создание и перебор элементов.
 */
export class TControlCollection<
	TItem extends AbstractControlItem<TControlType>,
	TControlType extends TControl<any> = TControl<any>,
> extends TCollectionOwned<TItem> {
	protected _itemCtor: TConstructor<TItem>

	/** Внутреннее состояние disabled */
	private _disabled: boolean

	constructor(owner: any, itemClass: TConstructor<TItem>, opts?: { disabled?: boolean }) {
		super(owner, itemClass)

		this._itemCtor = itemClass

		this._disabled = opts?.disabled ?? defaultValues.disabled
	}

	/**
	 * Флаг отключения всей коллекции.
	 * При установке значения обновляет все элементы.
	 */
	get disabled(): boolean {
		return this._disabled
	}

	set disabled(value: boolean) {
		if (this._disabled === value) return

		this._disabled = value

		// Применяем ко всем элементам
		this.forEach((item) => {
			;(item as TItem).disabled = value
		})
	}

	override add(source: Partial<TItem> = {}): TItem {
		// Применяем текущее состояние disabled к новому элементу
		source.disabled = this._disabled

		return super.add(source) as TItem
	}

	/**
	 * Создаёт и добавляет элемент в коллекцию.
	 * @param source Частичный набор свойств элемента
	 * @returns созданный элемент типа TItem
	 */
	addItem(source: Partial<TItem> = {}): TItem {
		return this.add(source) as TItem
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
	toArray<T extends TItem = TItem>(): T[] {
		return super.toArray<T>()
	}
}
