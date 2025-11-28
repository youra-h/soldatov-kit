import { TSelectableCollection } from '../../selectable/selectable-collection.class'
import type {
    ISelectionProvider,
    ITreeCollection,
    ITreeItem,
} from '../types'
import type { ISelectableCollectionItem } from '../../selectable/types'
import type { TConstructor } from '../../../../common/types'
import type { TSelectableTreeItem } from './selectable-tree-item.class'

export class TSelectableTreeCollection
    extends TSelectableCollection
    implements ITreeCollection, ISelectionProvider<ISelectableCollectionItem>
{
    public readonly owner?: ITreeItem

    constructor(options?: {
        itemClass?: TConstructor<any>
        mode?: 'single' | 'multiple' | 'none'
        owner?: ITreeItem
    }) {
        super(options)
        this.owner = options?.owner
    }

    /**
     * Получить все выбранные элементы (включая вложенные)
     */
    getSelection(): ISelectableCollectionItem[] {
        const selection: ISelectableCollectionItem[] = []

        // 1. Собственные выбранные
        selection.push(...this.selected)

        // 2. Рекурсивно с детей
        this.forEach((item: any) => {
            if (item.children && item.children instanceof TSelectableTreeCollection) {
                selection.push(...item.children.getSelection())
            }
        })

        return selection
    }

    getAllItems(): any[] {
        const items: any[] = []
        this.forEach((item: any) => {
            items.push(item)
            if (item.children) {
                items.push(...item.children.getAllItems())
            }
        })
        return items
    }

    /**
     * Переопределяем подписку, чтобы слушать события детей
     */
    protected _subscribeItem(item: TSelectableTreeItem): void {
        super._subscribeItem(item)

        // Слушаем изменения в дочерней коллекции
        item.children.events.on('change', (payload: { items: ISelectableCollectionItem[] }) => {
            // Если в дочерней ветке есть выбранные элементы
            if (payload.items.length > 0) {
                this._onChildTreeSelectionChanged(item)
            }
            
            // Пробрасываем событие наверх
            this.events.emit('change', {
                collection: this,
                items: this.getSelection(),
            })
        })
    }

    /**
     * Обработка выбора внутри дочернего элемента
     */
    private _onChildTreeSelectionChanged(sourceItem: TSelectableTreeItem): void {
        if (this.mode === 'single') {
            // Если режим single, то выбор в глубине должен сбросить выбор на текущем уровне
            // и в других ветках.

            // 1. Снимаем выделение с элементов текущего уровня
            // Так как _selected приватный, используем публичный API
            this.selected.forEach((it) => {
                it.selected = false
            })
            
            // 2. Очищаем выбор в соседних ветках
            this.forEach((it: any) => {
                if (it !== sourceItem && it.children) {
                    it.children.clear()
                }
            })
        }
    }
    
    /**
     * Переопределяем clear для рекурсивной очистки
     */
    clear(): void {
        // Очищаем детей
        this.forEach((item: any) => {
            if (item.children) item.children.clear()
        })
        // Очищаем себя
        super.clear()
    }
}