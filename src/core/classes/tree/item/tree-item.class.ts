import { TCollectionItem } from '../../collection/item/collection-item.class'
import { TTree } from '../tree.class'
import type { ITreeItem, ITreeItemProps, TTreeItemEvents } from './types'
import type { TConstructor } from '../../../common/types'

/**
 * Элемент дерева.
 * Может содержать вложенную коллекцию (child).
 */
export class TTreeItem<
	TProps extends ITreeItemProps = ITreeItemProps,
	TEvents extends TTreeItemEvents = TTreeItemEvents,
>
	extends TCollectionItem<TProps, TEvents>
	implements ITreeItem
{
	/**
	 * Внутренняя ссылка на дочернюю коллекцию.
	 * @protected
	 */
	protected _child: TTree | null = null

	/**
	 * Возвращает дочернюю коллекцию или null, если её нет.
	 */
	get child(): TTree | null {
		return this._child
	}

	/**
	 * Создает новую дочернюю коллекцию и привязывает её к этому элементу.
	 * @param itemClass Класс элементов, которые будут создаваться в дочерней коллекции.
	 * @returns Созданная коллекция.
	 */
	createChild<TChildItem extends TTreeItem>(
		itemClass: TConstructor<TChildItem>,
	): TTree<TChildItem> {
		// Если уже есть коллекция, очищаем её или возвращаем существующую (зависит от логики, здесь создаем новую)
		if (this._child) {
			this._child.clear()
			// Можно вернуть существующую, но для чистоты пересоздадим или просто вернем текущую
			// В данном примере заменим старую, предварительно освободив
			this.removeChild()
		}

		// Создаем новую коллекцию, указывая текущий элемент как родителя
		const childCollection = new TTree<TChildItem>({
			itemClass: itemClass,
			parentItem: this,
		})

		this._child = childCollection as unknown as TTree

		return childCollection
	}

	/**
	 * Прикрепляет уже существующую коллекцию в качестве дочерней.
	 * @param collection Коллекция для прикрепления.
	 */
	setChild(collection: TTree): void {
		if (this._child === collection) return

		if (this._child) {
			this.removeChild()
		}

		this._child = collection
		// Важно: сообщаем коллекции, кто её новый родитель
		collection.setParentItem(this)
	}

	/**
	 * Удаляет связь с дочерней коллекцией.
	 * Сама коллекция не уничтожается (free не вызывается), только отвязывается.
	 */
	removeChild(): void {
		if (this._child) {
			this._child.setParentItem(null)
			this._child = null
		}
	}

	/**
	 * Переопределение метода free для очистки вложенных ресурсов.
	 */
	free(): void {
		if (this._child) {
			// Рекурсивно очищаем дочернюю коллекцию
			this._child.clear()
			this._child = null
		}
		super.free()
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			child: this._child,
		}
	}
}
