import type { ICollection, ICollectionProps, TCollectionEvents } from '../collection/types'
import type { TEvented } from '../../common/evented'
import type { ITreeItem } from './item/types'

/**
 * Свойства коллекции дерева (ветки).
 */
export interface ITreeCollectionProps extends ICollectionProps {
	/** Родительский элемент, которому принадлежит эта ветка */
	parentItem: ITreeItem | null
}

/**
 * Интерфейс коллекции дерева (Branch).
 */
export interface ITreeCollection<TItem extends ITreeItem = ITreeItem> extends ICollection<
	ITreeCollectionProps,
	TCollectionEvents,
	TItem
> {
	/** Родительский элемент */
	readonly parentItem: ITreeItem | null

	/** Ссылка на корень дерева */
	readonly root: ITree

	/** Количество элементов (явно указываем, чтобы не терялось) */
	readonly count: number

	/**
	 * Уведомить коллекцию о событии в элементе (для всплытия).
	 * @internal
	 */
	notifyItemChange(item: ITreeItem, event: string): void
}

/**
 * События самого дерева (Корня).
 * Расширяем события коллекции, добавляя глобальное событие изменения.
 */
export type TTreeEvents = TCollectionEvents & {
	/**
	 * Глобальное событие: любой элемент в дереве изменился.
	 * Используется контроллерами для реакции на изменения в глубине.
	 * @param payload.item Элемент, который изменился
	 * @param payload.event Имя события (например, 'activeChange')
	 */
	itemChange: (payload: { item: ITreeItem; event: string }) => void
}

/**
 * Интерфейс корня дерева (Root).
 * Корень — это тоже коллекция, но с дополнительными возможностями.
 */
export interface ITree<TItem extends ITreeItem = ITreeItem> extends ITreeCollection<TItem> {
	/**
	 * Система событий дерева.
	 * Переопределяем тип событий на TTreeEvents.
	 */
	readonly events: TEvented<TTreeEvents>

	/**
	 * Поиск элемента по условию (в глубину).
	 * @param predicate Функция-условие
	 */
	find(predicate: (item: TItem) => boolean): TItem | undefined
}
