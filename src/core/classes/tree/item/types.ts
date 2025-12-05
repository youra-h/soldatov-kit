import type {
	ICollectionItem,
	ICollectionItemProps,
	TCollectionItemEvents,
} from '../../collection'
import { TTree } from './../tree.class'

/**
 * Свойства элемента дерева.
 */
export interface ITreeItemProps extends ICollectionItemProps {
	/** Ссылка на дочернюю коллекцию (если есть) */
	child: TTree | null
}

/**
 * События элемента дерева.
 */
export type TTreeItemEvents = TCollectionItemEvents & {
	// Здесь можно добавить специфичные события, например, разворачивание/сворачивание ветки
}

/**
 * Интерфейс элемента дерева.
 */
export interface ITreeItem extends ICollectionItem<ITreeItemProps, TTreeItemEvents> {
	/** Дочерняя коллекция элементов */
	readonly child: TTree | null

	/**
	 * Создает новую дочернюю коллекцию для этого элемента.
	 * @param itemClass Класс элементов, которые будут в дочерней коллекции.
	 */
	createChild(itemClass: any): TTree

	/**
	 * Прикрепляет существующую коллекцию в качестве дочерней.
	 * @param collection Коллекция для прикрепления.
	 */
	setChild(collection: TTree): void

	/**
	 * Удаляет дочернюю коллекцию.
	 */
	removeChild(): void
}
