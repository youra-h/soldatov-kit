import { TTree } from './../tree.class'
import { TreeActivationController } from './../controllers/activation.controller'
import { TActivatableTreeItem } from './activable-tree-item.class'
import type { TConstructor } from '../../../common/types'

/**
 * Корневой класс Активируемого Дерева.
 * @template TItem Тип элемента (должен наследовать TActivatableTreeItem)
 */
export class TActivatableTree<
	TItem extends TActivatableTreeItem = TActivatableTreeItem,
> extends TTree<TItem> {
	private _controller: TreeActivationController

	// Разрешаем передавать свой класс элемента
	constructor(options?: { itemClass?: TConstructor<TItem> }) {
		super({
			itemClass:
				options?.itemClass ?? (TActivatableTreeItem as unknown as TConstructor<TItem>),
		})
		this._controller = new TreeActivationController(this)
	}

	get activeItem(): TItem | null {
		return this._controller.activeItem as TItem | null
	}
}
