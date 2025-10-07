import { AbstractControlItem } from '../control/control-item.class'
import type { ISelectable } from '../types'

/**
 * Элемент списка. Контрол со значением text и флагом selected.
 */
export class TListItem extends AbstractControlItem implements ISelectable {
	/** Выбран ли элемент */
	protected _selected: boolean = false

	get selected(): boolean {
		return this._selected
	}

	set selected(value: boolean) {
		if (this._selected !== value) {
			this._selected = value
			this.changed()
		}
	}

	/**
	 * Копирует данные из другого TListItem.
	 * @param source Источник данных
	 */
	assign(source: TListItem): void {
		super.assign(source)

		if (!source) return

		this._selected = source.selected ?? false
	}

	/**
	 * Переключает состояние selected и уведомляет коллекцию.
	 */
	toggleSelect(): void {
		this.selected = !this.selected
	}
}
