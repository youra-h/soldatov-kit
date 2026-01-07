import type { TTree } from '../tree.class'
import type { ITreeItem } from '../item/types'
import type { TSelectionMode } from '../../../base/collection'
import type { TSelectableBehavior } from '../../../base/behaviors'

interface IItemWithSelectable {
	behavior: TSelectableBehavior
}

/**
 * Контроллер глобального выбора для дерева.
 *
 * Слушает всплывающие события `itemChange` от корня дерева и поддерживает
 * актуальный набор выбранных элементов (включая вложенные уровни).
 *
 * Ожидаемый контракт:
 * - элементы дерева должны эмитить в корень событие `behaviorChange`
 *   (это делает `TBehaviorTreeItem` при изменении поведения)
 * - у элемента должно быть поведение с булевым свойством `selected`
 *
 * Выбор хранится во внутреннем `Set`, чтобы операции add/delete были O(1).
 */
export class TreeSelectionController {
	private _tree: TTree & { mode?: TSelectionMode }
	private _selected: Set<ITreeItem & IItemWithSelectable> = new Set()

	constructor(tree: TTree & { mode?: TSelectionMode }) {
		this._tree = tree
		this._tree.events.on('itemChange', this._handleItemChange.bind(this))
	}

	private _handleItemChange(payload: { item: ITreeItem; event: string }) {
		if (payload.event !== 'behaviorChange') return

		const item = payload.item as unknown as ITreeItem & IItemWithSelectable

		if (!item.behavior || typeof item.behavior.selected !== 'boolean') return

		const mode: TSelectionMode = this._tree.mode ?? 'multiple'

		if (item.behavior.selected) {
			if (mode === 'none') {
				item.behavior.selected = false
				return
			}

			if (mode === 'single') {
				for (const prev of Array.from(this._selected)) {
					if (prev !== item) {
						prev.behavior.selected = false
					}
				}
				this._selected.clear()
			}

			this._selected.add(item)
			return
		}

		this._selected.delete(item)
	}

	/**
	 * Текущий набор выбранных элементов.
	 *
	 * Порядок не гарантируется (это массив из `Set`).
	 */
	get selectedItems(): Array<ITreeItem & IItemWithSelectable> {
		return Array.from(this._selected)
	}

	/** Количество выбранных элементов. */
	get selectedCount(): number {
		return this._selected.size
	}

	/** Снять выделение со всех элементов и очистить внутренний набор. */
	clear(): void {
		for (const item of Array.from(this._selected)) {
			item.behavior.selected = false
		}
		this._selected.clear()
	}
}
