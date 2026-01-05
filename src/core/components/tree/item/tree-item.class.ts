import { TCollectionItem } from '../../collection/item/collection-item.class'
import { TTreeCollection } from '../tree-collection.class'
import type { ITreeCollection, ITree } from '../types'
import type { ITreeItem, ITreeItemProps, TTreeItemEvents } from './types'
import type { TConstructor } from '../../../common/types'

/**
 * Базовый элемент дерева.
 */
export class TTreeItem<
	TProps extends ITreeItemProps = ITreeItemProps,
	TEvents extends TTreeItemEvents = TTreeItemEvents,
>
	extends TCollectionItem<TProps, TEvents>
	implements ITreeItem
{
	protected _child: ITreeCollection | null = null

	get child(): ITreeCollection | null {
		return this._child
	}

	get root(): ITree {
		if (!this.collection) {
			throw new Error('Item is not attached to any collection, cannot find root')
		}
		return (this.collection as unknown as ITreeCollection).root
	}

	/**
	 * Реализация с дженериком.
	 */
	createChild(): ITreeCollection<this>
	createChild<TChild extends ITreeItem>(itemClass: TConstructor<TChild>): ITreeCollection<TChild>
	createChild<TChild extends ITreeItem>(itemClass?: TConstructor<TChild>): ITreeCollection<TChild> {
		if (this._child) {
			this._child.clear()
		}

		const resolvedItemClass =
			(itemClass ?? (this.constructor as unknown as TConstructor<TChild>))

		// Создаем коллекцию и приводим её к нужному типу
		const childCollection = new TTreeCollection<TChild>({
			itemClass: resolvedItemClass,
			parentItem: this,
		})

		// Сохраняем как ITreeCollection (общий тип), но возвращаем типизированную
		this._child = childCollection as unknown as ITreeCollection

		return childCollection
	}

	removeChild(): void {
		if (this._child) {
			this._child.clear()
			this._child = null
		}
	}

	free(): void {
		this.removeChild()
		super.free()
	}

	/**
	 * Реализация метода из интерфейса ITreeItem.
	 * Получает событие от дочерней ветки (child) и передает его своей коллекции.
	 */
	public notifyChildChange(item: ITreeItem, event: string): void {
		if (this.collection) {
			;(this.collection as unknown as ITreeCollection).notifyItemChange(item, event)
		}
	}

	/**
	 * Защищенный метод для отправки собственных событий вверх по дереву.
	 * Используется в наследниках (например, при изменении active).
	 */
	protected notifyChange(event: string = 'change'): void {
		if (this.collection) {
			;(this.collection as unknown as ITreeCollection).notifyItemChange(this, event)
		}
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			child: this._child,
		}
	}
}
