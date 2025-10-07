import { TCollectionItem } from './../collection-item.class'
import { type IControl, TControl, defaultValuesControl } from './../../control'
import { defaultValuesComponent } from '../../component'
import type { TComponentSize } from '../../../common/types'
import { TSize } from '../../../common/size'

/**
 * Абстрактный элемент коллекции для UI-контролов.
 * Наследники должны расширять assign и могут добавлять свои поля.
 */
export abstract class AbstractControlItem extends TCollectionItem implements IControl {
	private _control: TControl<any>

	constructor() {
		super()

		this._control = new TControl<any>({ props: defaultValuesControl })
	}

	/**
	 * Копирует данные из source в текущий элемент.
	 * Наследники должны вызывать super.assign(source) и копировать свои поля.
	 * @param source Источник данных
	 */
	assign(source: AbstractControlItem): void {
		super.assign(source)

		if (!source) return

		this._control
	}

	get tag(): string | Object {
		return this._tag
	}
	set tag(value: string | Object) {
		if (this._tag !== value) {
			this._tag = value
			this.changed()
		}
	}

	get visible(): boolean {
		return this._visible
	}

	set visible(value: boolean) {
		if (this._visible !== value) {
			this._visible = value
			this.changed()
		}
	}

	get hidden(): boolean {
		return this._hidden
	}

	set hidden(value: boolean) {
		if (this._hidden !== value) {
			this._hidden = value
			this.changed()
		}
	}

	get name(): string {
		return this._name
	}

	set name(value: string) {
		if (this._name !== value) {
			this._name = value
			this.changed()
		}
	}

	get text(): string {
		return this._text
	}

	set text(value: string) {
		if (this._text !== value) {
			this._text = value
			this.changed()
		}
	}

	get disabled(): boolean {
		return this._disabled
	}

	set disabled(value: boolean) {
		if (this._disabled !== value) {
			this._disabled = value
			this.changed()
		}
	}

	get focused(): boolean {
		return this._focused
	}

	set focused(value: boolean) {
		if (this._focused !== value) {
			this._focused = value
			this.changed()
		}
	}

	get size(): TComponentSize {
		return this._sizeHelper.value
	}

	set size(value: TComponentSize) {
		if (this._sizeHelper.value !== value) {
			this._sizeHelper.value = value
			this.changed()
		}
	}

	/**
	 * Уведомляет, что элемент изменился (для реактивного обновления владельца).
	 */
	changed(): void {
		super.changed()
	}
}
