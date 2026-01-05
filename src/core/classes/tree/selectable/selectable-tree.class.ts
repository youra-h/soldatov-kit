import { TTree } from './../tree.class'
import { TreeSelectionController } from './../controllers/selection.controller'
import { TSelectableTreeItem } from './selectable-tree-item.class'
import type { TConstructor } from '../../../common/types'
import type { TSelectionMode } from '../../collection/selectable/types'

/**
 * Корневой класс дерева с поддержкой выделения (selection).
 *
 * Реализует глобальный выбор по всему дереву (включая вложенные уровни).
 * Состояние выбранности хранится в элементах (`item.selected`),
 * а корень держит быстрый «снимок» выбранных элементов (`selectedItems`).
 *
 * Режимы:
 * - `multiple` (по умолчанию): можно выбрать несколько элементов
 * - `single`: в дереве может быть выбран только один элемент
 * - `none`: выбор запрещён (любая попытка выбора будет сброшена)
 */
export class TSelectableTree<TItem extends TSelectableTreeItem = TSelectableTreeItem> extends TTree<TItem> {
	private _controller: TreeSelectionController
	protected _mode: TSelectionMode

	/**
	 * @param options.itemClass Класс элементов дерева (по умолчанию `TSelectableTreeItem`)
	 * @param options.mode Режим выбора (по умолчанию `multiple`)
	 */
	constructor(options?: { itemClass?: TConstructor<TItem>; mode?: TSelectionMode }) {
		super({
			itemClass: options?.itemClass ?? (TSelectableTreeItem as unknown as TConstructor<TItem>),
		})

		this._mode = options?.mode ?? 'multiple'
		this._controller = new TreeSelectionController(this)
	}

	/** Текущий режим выбора для всего дерева. */
	get mode(): TSelectionMode {
		return this._mode
	}

	/**
	 * Устанавливает режим выбора.
	 *
	 * Правила:
	 * - `none`: снимает выбор со всех элементов
	 * - `single`: если выбрано несколько, оставляет только первый выбранный
	 */
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

	/**
	 * Массив выбранных элементов дерева.
	 *
	 * Примечание: порядок не гарантируется (внутри контроллера хранится `Set`).
	 */
	get selectedItems(): TItem[] {
		return this._controller.selectedItems as unknown as TItem[]
	}

	/** Количество выбранных элементов. */
	get selectedCount(): number {
		return this._controller.selectedCount
	}

	/** Снять выделение со всех элементов дерева. */
	clearSelection(): void {
		this._controller.clear()
	}
}
