import type {
	ICollectionItem,
	ICollectionItemProps,
	TCollectionItemEvents,
} from '../../collection/item/types'
import type { TConstructor } from '../../../common/types'
import type { ITreeCollection, ITree } from '../types'

/**
 * Свойства элемента дерева.
 */
export interface ITreeItemProps extends ICollectionItemProps {
	/** Ссылка на дочернюю коллекцию (ветку) */
	child: ITreeCollection | null
}

/**
 * События элемента дерева.
 */
export type TTreeItemEvents = TCollectionItemEvents & {
	// Здесь можно добавить специфичные события элемента (например, expand/collapse)
}

/**
 * Интерфейс элемента дерева (Node).
 */
export interface ITreeItem extends ICollectionItem<ITreeItemProps, TTreeItemEvents> {
	/** Дочерняя ветка */
	readonly child: ITreeCollection | null

	/** Ссылка на корень дерева (вычисляемая) */
	readonly root: ITree

	/**
	 * Создает дочернюю ветку.
	 * @param itemClass Класс элементов, которые будут в новой ветке.
	 */
	createChild<TChild extends ITreeItem>(itemClass: TConstructor<TChild>): ITreeCollection<TChild>

	/** Удаляет дочернюю ветку */
	removeChild(): void

	/**
	 * Уведомить родителя о событии в дочерней ветке (для всплытия).
	 * @internal
	 */
	notifyChildChange(item: ITreeItem, event: string): void
}
