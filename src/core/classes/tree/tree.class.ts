import { TTreeCollection } from './tree-collection.class'
import type { ITree, TTreeEvents } from './types'
import type { ITreeItem } from './item/types'
import type { TConstructor } from '../../common/types'

export class TTree<TItem extends ITreeItem = ITreeItem, TEvents extends TTreeEvents = TTreeEvents>
	extends TTreeCollection<TItem, TEvents>
	implements ITree
{
	constructor(options: { itemClass: TConstructor<TItem> }) {
		super({ ...options, parentItem: null })
	}

	get root(): ITree {
		return this
	}

	/**
	 * 1. Метод для всплытия событий (Bubbling endpoint).
	 * Сюда приходят события от всех элементов дерева.
	 */
	public notifyItemChange(item: ITreeItem, event: string): void {
		this.events.emit('itemChange', { item, event })
	}

	/**
	 * 2. Универсальный поиск по дереву (DFS - поиск в глубину).
	 * @param predicate Функция-условие
	 */
	public find(predicate: (item: TItem) => boolean): TItem | undefined {
		// Ищем в текущем уровне и во вложенных
		return this._findRecursive(this, predicate)
	}

	private _findRecursive(
		collection: TTreeCollection<TItem>,
		predicate: (item: TItem) => boolean,
	): TItem | undefined {
		for (let i = 0; i < collection.count; i++) {
			const item = collection.getItem(i)
			if (!item) continue

			// Проверяем сам элемент
			if (predicate(item)) {
				return item
			}

			// Если есть дети, ищем внутри
			if (item.child && item.child.count > 0) {
				const found = this._findRecursive(
					item.child as unknown as TTreeCollection<TItem>,
					predicate,
				)
				if (found) return found
			}
		}
		return undefined
	}
}
