import { TCollection } from '../collection/collection.class'
import { TTreeItem } from './item/tree-item.class'
import type { ITreeCollection, ITreeCollectionProps } from './types'
import type { TCollectionEvents } from '../collection/types'
import type { TConstructor } from '../../common/types'

/**
 * Древовидная коллекция.
 * Может быть корневой или вложенной в TTreeItem.
 */
export class TTree<TItem extends TTreeItem = TTreeItem>
	extends TCollection<ITreeCollectionProps, TCollectionEvents, TItem>
	implements ITreeCollection
{
	/**
	 * Ссылка на родительский элемент, который содержит эту коллекцию как child.
	 * Если null, то это корневая коллекция.
	 * @protected
	 */
	protected _parentItem: TTreeItem | null = null

	constructor(options: { itemClass: TConstructor<TItem>; parentItem?: TTreeItem }) {
		super(options)

		if (options.parentItem) {
			this._parentItem = options.parentItem
		}
	}

	/**
	 * Возвращает родительский элемент.
	 */
	get parentItem(): TTreeItem | null {
		return this._parentItem
	}

	/**
	 * Устанавливает родительский элемент.
	 * Используется при прикреплении коллекции к элементу.
	 * @param item Элемент-родитель
	 */
	setParentItem(item: TTreeItem | null): void {
		this._parentItem = item
	}

	/**
	 * Получение свойств коллекции.
	 */
	getProps(): ITreeCollectionProps {
		return {
			...super.getProps(),
			parentItem: this._parentItem,
		}
	}
}
