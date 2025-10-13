import { AbstractControlItem } from '../collection/control/control-item.class'
import type { ISelectable } from '../collection/selectable/types'

/**
 * Элемент вкладки.
 * Наследует поведение контрола через AbstractControlItem и добавляет флаг selected.
 */
export class TTabItem extends AbstractControlItem implements ISelectable {
	private _selected = false

	/**
	 * Флаг выбранности вкладки.
	 * При изменении вызывает changed() для нотификации коллекции/владельца.
	 */
	get selected(): boolean {
		return this._selected
	}

	set selected(value: boolean) {
		if (this._selected === value) return

		this._selected = value

		this.changed()
	}

	/**
	 * Копирует данные из другого TTabItem.
	 * @param source Источник данных
	 */
	assign(source: TTabItem): void {
		super.assign(source)

		if (!source) return

		this._selected = !!source.selected
	}
}
