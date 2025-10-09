import { AbstractControlItem } from '../collection/control/control-item.class'
import type { ISelectable } from '../collection/selectable/types'

/**
 * Элемент вкладки.
 * Наследует поведение контрола через AbstractControlItem и добавляет флаг selected.
 */
export class TabItem extends AbstractControlItem implements ISelectable {
	private _selected = false

	constructor(control?: any) {
		super(control)
	}

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
	 * Копирует данные из другого TabItem.
	 * @param source Источник данных
	 */
	assign(source: TabItem): void {
		super.assign(source)
		if (!source) return
		this._selected = !!source.selected
	}
}
