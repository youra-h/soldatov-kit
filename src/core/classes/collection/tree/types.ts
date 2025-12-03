import type { ICollection, ICollectionProps, TCollectionEvents } from '../types'
import type { ICollectionItem, ICollectionItemProps, TCollectionItemEvents } from '../item/types'

/**
 * Интерфейс для получения текущего выбора (независимо от типа коллекции).
 * Позволяет использовать DI.
 */
export interface ISelectionProvider<T = any> {
    getSelection(): T[]
}

/**
 * Свойства элемента дерева.
 */
export interface ITreeItemProps extends ICollectionItemProps {
    /** Есть ли у элемента дети */
    hasChildren: boolean
    /** Развернут ли элемент (для UI) */
    expanded?: boolean
}

/**
 * Элемент дерева. Должен иметь коллекцию детей.
 */
export interface ITreeItem<
    TProps extends ITreeItemProps = ITreeItemProps,
    TEvents extends TCollectionItemEvents = TCollectionItemEvents
> extends ICollectionItem<TProps, TEvents> {
    /** Коллекция дочерних элементов */
    readonly children: ITreeCollection
    /** Ссылка на родительский элемент (если есть) */
    readonly parent: ITreeItem | null
}

/**
 * Интерфейс коллекции дерева.
 */
export interface ITreeCollection<
    TProps extends ICollectionProps = ICollectionProps,
    TEvents extends TCollectionEvents = TCollectionEvents,
    TItem extends ITreeItem = ITreeItem,
> extends ICollection<TProps, TEvents, TItem> {
    /** Владелец коллекции (родительский элемент) */
    readonly owner?: ITreeItem
    /** Получить плоский список всех элементов дерева (рекурсивно) */
    getAllItems(): TItem[]
}
