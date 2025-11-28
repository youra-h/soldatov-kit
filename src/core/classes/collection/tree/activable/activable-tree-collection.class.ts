import { TActivatableCollection } from '../../activable/activable-collection.class'
import type { ISelectionProvider, ITreeCollection, ITreeItem } from '../types'
import type { TConstructor } from '../../../../common/types'
import type { TActivatableTreeItem } from './activable-tree-item.class'
import type { ICollectionItem } from '../../item/types'

export class TActivatableTreeCollection
	extends TActivatableCollection
	implements ITreeCollection, ISelectionProvider<ICollectionItem>
{
	public readonly owner?: ITreeItem

	constructor(options?: { itemClass?: TConstructor<any>; owner?: ITreeItem }) {
		super(options)
		this.owner = options?.owner
	}

	/**
	 * Возвращает массив с единственным активным элементом (или пустой),
	 * найденным рекурсивно по всему дереву.
	 */
	getSelection(): ICollectionItem[] {
		const active = this.getActiveItemRecursive()
		return active ? [active] : []
	}

	/**
	 * Получить плоский список всех элементов дерева.
	 */
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
	 * Рекурсивный поиск активного элемента в глубину.
	 */
	getActiveItemRecursive(): any | undefined {
		// 1. Проверяем, активен ли кто-то на текущем уровне
		if (this.activeItem) return this.activeItem

		// 2. Ищем в детях
		for (const item of this.toArray() as any[]) {
			if (item.children && item.children instanceof TActivatableTreeCollection) {
				const childActive = item.children.getActiveItemRecursive()
				if (childActive) return childActive
			}
		}
		return undefined
	}

	/**
	 * Переопределяем подписку на элементы, чтобы слушать события вложенных коллекций.
	 */
	protected _subscribeItem(item: TActivatableTreeItem): void {
		super._subscribeItem(item)

		// Слушаем события изменения в дочерней коллекции элемента
		if (item.children) {
			item.children.events.on('change', (payload: { item?: ICollectionItem }) => {
				if (payload.item) {
					// В глубине дерева активировался элемент (payload.item).

					// 1. Если на ТЕКУЩЕМ уровне был активный элемент (и это не тот, внутри которого произошло событие),
					// мы должны его деактивировать.
					// Примечание: если this.activeItem === item, то это нормально (путь к активному элементу).
					// Но если this.activeItem === другой_сосед, его надо сбросить.
					if (this.activeItem && this.activeItem !== item) {
						// Используем super.clear(), чтобы сбросить _activeItem и эмитировать событие,
						// но аккуратно, чтобы не затереть всплывающее событие.
						// В данном случае проще вручную снять флаг:
						this.activeItem.active = false
						// И сбросить ссылку (через приватное поле или метод, если доступен,
						// но так как мы наследуемся, у нас нет доступа к private _activeItem напрямую,
						// если он private. Если protected - ок. В исходнике он private).
						// Поэтому вызываем clear(), но он эмитит событие 'change' с undefined.
						super.clear()
					}

					// 2. Проходим по всем соседям (кроме того, откуда пришло событие)
					// и рекурсивно очищаем их активность.
					this.forEach((it: any) => {
						if (it !== item && it.children) {
							it.children.clear()
						}
					})

					// 3. Пробрасываем событие наверх, чтобы родитель этой коллекции тоже узнал.
					this.events.emit('change', { collection: this, item: payload.item })
				}
			})
		}
	}

	/**
	 * Очистка всего дерева.
	 */
	clear(): void {
		// Сначала рекурсивно очищаем детей
		this.forEach((item: any) => {
			if (item.children) item.children.clear()
		})
		// Затем очищаем текущий уровень
		super.clear()
	}
}
