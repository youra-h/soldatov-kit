import { TCollectionItem } from '../item/collection-item.class'
import type { ITreeItem, ITreeItemProps, ITreeCollection } from './types'
import type { TConstructor } from '../../../common/types'

/**
 * Базовый класс элемента дерева.
 * TChildCollection - тип коллекции, которая будет создана в children.
 */
export abstract class TTreeItem<
    TProps extends ITreeItemProps = ITreeItemProps,
    TEvents extends any = any
> extends TCollectionItem<TProps, TEvents> implements ITreeItem {
    
    public readonly children: ITreeCollection
    
    constructor(collection: ITreeCollection, childrenCollectionClass: TConstructor<ITreeCollection>) {
        super(collection)
        // Создаем дочернюю коллекцию того же типа, что и родительская (обычно)
        // Или передаем класс через опции. Здесь упрощенно:
        this.children = new childrenCollectionClass({ itemClass: (this.constructor as any) })
    }

    get parent(): ITreeItem | null {
        // Если коллекция принадлежит айтему, то owner коллекции - это наш родитель
        // В текущей реализации TCollection не хранит ссылку на "владельца-айтема", 
        // это нужно предусмотреть в архитектуре, либо передавать явно.
        // Для простоты допустим, что мы можем это вычислить или хранить.
        return null // TODO: Реализовать связь с родителем
    }

    getProps(): TProps {
        return {
            ...super.getProps(),
            hasChildren: this.children.count > 0
        }
    }
    
    free(): void {
        this.children.clear()
        super.free()
    }
}