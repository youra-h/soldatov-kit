import type { ICollection, ICollectionProps, TCollectionEvents } from '../collection/types'
import { TTreeItem } from './item/tree-item.class'

/**
 * Свойства коллекции дерева.
 */
export interface ITreeCollectionProps extends ICollectionProps {
	/** Элемент-родитель, которому принадлежит эта коллекция (если это вложенный уровень) */
	parentItem: TTreeItem | null
}

/**
 * Интерфейс коллекции дерева.
 */
export interface ITreeCollection extends ICollection<
	ITreeCollectionProps,
	TCollectionEvents,
	TTreeItem
> {
	/** Ссылка на родительский элемент (узел), содержащий эту коллекцию */
	readonly parentItem: TTreeItem | null
}
