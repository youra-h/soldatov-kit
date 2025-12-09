import type { TTree } from '../tree.class'
import type { ITreeItem } from '../types'
import type { TActivatableBehavior } from '../../behavior/activable.behavior'

// Интерфейс элемента, который ожидает контроллер
interface IItemWithActivatable {
	behavior: TActivatableBehavior
}

export class TreeActivationController {
	private _tree: TTree
	private _activeItem: (ITreeItem & IItemWithActivatable) | null = null

	constructor(tree: TTree) {
		this._tree = tree
		// Слушаем глобальные изменения
		this._tree.events.on('itemChange', this._handleItemChange.bind(this))
	}

	private _handleItemChange(payload: { item: ITreeItem; event: string }) {
		// Реагируем только на изменения поведения
		if (payload.event !== 'behaviorChange') return

		const item = payload.item as unknown as ITreeItem & IItemWithActivatable

		// Проверка безопасности: есть ли у элемента нужное поведение
		if (!item.behavior || typeof item.behavior.active !== 'boolean') return

		if (item.behavior.active) {
			// Элемент активировался -> Выключаем старый
			if (this._activeItem && this._activeItem !== item) {
				this._activeItem.behavior.active = false
			}
			this._activeItem = item
		} else {
			// Элемент деактивировался сам -> Сбрасываем ссылку
			if (this._activeItem === item) {
				this._activeItem = null
			}
		}
	}

	/**
	 * Получить активный элемент (Поиск по состоянию - мгновенный)
	 */
	get activeItem() {
		return this._activeItem
	}
}
