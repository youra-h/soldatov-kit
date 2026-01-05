import { TTree } from './../tree.class'
import { TreeSelectionController } from './../controllers/selection.controller'
import { TSelectableTreeItem } from './selectable-tree-item.class'
import type { TConstructor } from '../../../common/types'
import type { TSelectionMode } from '../../collection/selectable/types'

export class TSelectableTree<TItem extends TSelectableTreeItem = TSelectableTreeItem> extends TTree<TItem> {
	private _controller: TreeSelectionController
	protected _mode: TSelectionMode

	constructor(options?: { itemClass?: TConstructor<TItem>; mode?: TSelectionMode }) {
		super({
			itemClass: options?.itemClass ?? (TSelectableTreeItem as unknown as TConstructor<TItem>),
		})

		this._mode = options?.mode ?? 'multiple'
		this._controller = new TreeSelectionController(this)
	}

	get mode(): TSelectionMode {
		return this._mode
	}

	set mode(value: TSelectionMode) {
		if (this._mode === value) return

		this._mode = value

		if (value === 'none') {
			this.clearSelection()
			return
		}

		if (value === 'single' && this.selectedCount > 1) {
			const keep = this.selectedItems[0]
			for (const it of this.selectedItems) {
				if (it !== keep) it.selected = false
			}
		}
	}

	get selectedItems(): TItem[] {
		return this._controller.selectedItems as unknown as TItem[]
	}

	get selectedCount(): number {
		return this._controller.selectedCount
	}

	clearSelection(): void {
		this._controller.clear()
	}
}
