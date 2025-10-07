import { TCollectionItem } from './../collection-item.class'
import { type IControl, TControl } from './../../control'
import type { TComponentSize } from '../../../common/types'

/**
 * Абстрактный элемент коллекции для UI-контролов.
 * Наследники должны расширять assign и могут добавлять свои поля.
 */
export abstract class AbstractControlItem<TControlType extends TControl<any> = TControl<any>>
	extends TCollectionItem
	implements IControl
{
	protected _control: TControlType

	constructor(control?: TControlType) {
		super()

		this._control = control ?? (TControl.create() as TControlType)
	}

	/**
	 * Копирует данные из source в текущий элемент.
	 * Наследники должны вызывать super.assign(source) и копировать свои поля.
	 * @param source Источник данных
	 */
	assign(source: AbstractControlItem<TControlType>): void {
		super.assign(source)

		if (!source) return

		this._control.assign(source)
	}

	get tag(): string | Object {
		return this._control.tag
	}

	set tag(value: string | Object) {
		this._control.tag = value
	}

	get visible(): boolean {
		return this._control.visible
	}

	set visible(value: boolean) {
		this._control.visible = value
	}

	get hidden(): boolean {
		return this._control.hidden
	}

	set hidden(value: boolean) {
		this._control.hidden = value
	}

	get name(): string {
		return this._control.name
	}

	set name(value: string) {
		this._control.name = value
	}

	get text(): string {
		return this._control.text
	}

	set text(value: string) {
		this._control.text = value
	}

	get disabled(): boolean {
		return this._control.disabled
	}

	set disabled(value: boolean) {
		this._control.disabled = value
	}

	get focused(): boolean {
		return this._control.focused
	}

	set focused(value: boolean) {
		this._control.focused = value
	}

	get size(): TComponentSize {
		return this._control.size
	}

	set size(value: TComponentSize) {
		this._control.size = value
	}

	/**
	 * Уведомляет, что элемент изменился (для реактивного обновления владельца).
	 */
	changed(): void {
		super.changed()
	}
}
