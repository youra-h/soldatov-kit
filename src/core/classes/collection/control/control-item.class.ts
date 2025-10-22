import { TCollection } from './../collection.class'
import { TCollectionItem } from './../collection-item.class'
import { type IControl, TControl } from './../../control'
import type { TComponentSize } from '../../../common/types'
import type { TEventEmitter } from '../../../common/event-emitter'
import type { IControlItem } from './types'

/**
 * Абстрактный элемент коллекции для UI-контролов.
 * Наследники должны расширять assign и могут добавлять свои поля.
 */
export abstract class AbstractControlItem<
		TControlType extends TControl<any> = TControl<any>,
		TProps extends IControlItem = IControlItem,
	>
	extends TCollectionItem<TProps>
	implements IControl
{
	protected _control: TControlType | null

	constructor(collection?: TCollection) {
		super(collection)

		this._control = TControl.create() as TControlType
	}

	/**
	 * Копирует данные из source в текущий элемент.
	 * Наследники должны вызывать super.assign(source) и копировать свои поля.
	 * @param source Источник данных
	 */
	assign(source: Partial<TProps>): void {
		super.assign(source)

		if (!source) return

		this._control!.assign(source)
	}

	free(): void {
		super.free()

		this._control = null
	}

	get events(): TEventEmitter {
		return this._control!.events
	}

	get tag(): string | Object {
		return this._control!.tag
	}

	set tag(value: string | Object) {
		this._control!.tag = value
	}

	get visible(): boolean {
		return this._control!.visible
	}

	set visible(value: boolean) {
		this._control!.visible = value
	}

	get hidden(): boolean {
		return this._control!.hidden
	}

	set hidden(value: boolean) {
		this._control!.hidden = value
	}

	get name(): string {
		return this._control!.name
	}

	set name(value: string) {
		this._control!.name = value
	}

	get text(): string {
		return this._control!.text
	}

	set text(value: string) {
		this._control!.text = value
	}

	get disabled(): boolean {
		return this._control!.disabled
	}

	set disabled(value: boolean) {
		this._control!.disabled = value
	}

	get focused(): boolean {
		return this._control!.focused
	}

	set focused(value: boolean) {
		this._control!.focused = value
	}

	get size(): TComponentSize {
		return this._control!.size
	}

	set size(value: TComponentSize) {
		this._control!.size = value
	}

	/**
	 * Уведомляет, что элемент изменился (для реактивного обновления владельца).
	 */
	changed(): void {
		super.changed()
	}

	getProps(): TProps {
		return {
			...super.getProps(),
			...this._control!.getProps(),
		}
	}

	show(): void {
		this._control!.show()
	}

	hide(): void {
		this._control!.hide()
	}

	beforeShow(): boolean {
		return this._control!.beforeShow()
	}

	beforeHide(): boolean {
		return this._control!.beforeHide()
	}

	afterShow(): void {
		this._control!.afterShow()
	}

	afterHide(): void {
		this._control!.afterHide()
	}
}
