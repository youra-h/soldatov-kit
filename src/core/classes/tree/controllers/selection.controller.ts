import type { TTree } from '../tree.class'
import type { ITreeItem } from '../item/types'
import type { TSelectionMode } from '../../collection/selectable/types'
import type { TSelectableBehavior } from '../../behavior/selectable.behavior'

interface IItemWithSelectable {
	behavior: TSelectableBehavior
}

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

	get selectedItems(): Array<ITreeItem & IItemWithSelectable> {
		return Array.from(this._selected)
	}

	get selectedCount(): number {
		return this._selected.size
	}

	clear(): void {
		for (const item of Array.from(this._selected)) {
			item.behavior.selected = false
		}
		this._selected.clear()
	}
}
