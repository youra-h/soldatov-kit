import { TCollection } from '../collection/collection.class'
import type { ITreeCollection, ITreeCollectionProps, ITree } from './types'
import type { ITreeItem } from './item/types'
import type { TCollectionEvents } from '../collection/types'
import type { TConstructor } from '../../common/types'

export class TTreeCollection<
	TItem extends ITreeItem = ITreeItem,
	TEvents extends TCollectionEvents = TCollectionEvents,
>
	extends TCollection<ITreeCollectionProps, TEvents, TItem>
	implements ITreeCollection
{
	protected _parentItem: ITreeItem | null = null

	constructor(options: { itemClass: TConstructor<TItem>; parentItem?: ITreeItem | null }) {
		super(options)
		this._parentItem = options.parentItem ?? null
	}

	get parentItem(): ITreeItem | null {
		return this._parentItem
	}

	get root(): ITree {
		if (this._parentItem) {
			return this._parentItem.root
		}
		return this as unknown as ITree
	}

	/**
	 * Реализация метода из интерфейса ITreeCollection.
	 * Передает событие вверх родительскому элементу.
	 */
	public notifyItemChange(item: ITreeItem, event: string): void {
		// Если есть родительский элемент, передаем ему
		if (this._parentItem) {
			this._parentItem.notifyChildChange(item, event)
		}
		// Если родителя нет, значит мы - Корень (TTree).
		// В классе TTree этот метод будет переопределен, чтобы эмитить глобальное событие.
	}

	/**
	 * Явно реализуем свойство count из интерфейса, хотя оно есть в TCollection.
	 * Это помогает TS понять, что контракт соблюден.
	 */
	get count(): number {
		return this._items.length
	}

	getProps(): ITreeCollectionProps {
		return {
			...super.getProps(),
			parentItem: this._parentItem,
		}
	}
}
