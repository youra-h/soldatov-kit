import { TActivatableCollectionItem } from '../../../base/collection/activable/activable-collection-item.class'
import type { TCollection } from '../../../base/collection'
import TTabItemCustom from './tab-item-custom.class'
import type { ITabItem, ITabItemProps, TTabItemEvents } from './types'

/**
 * Элемент таба для работы в коллекции.
 * Композиция: TActivatableCollectionItem + TTabItemCustom.
 */
export default class TTabItem
	extends TActivatableCollectionItem<ITabItemProps, TTabItemEvents>
	implements ITabItem
{
	protected _customItem: TTabItemCustom

	constructor(collection?: TCollection) {
		super(collection)

		// Создаем кастомный элемент таба
		this._customItem = new TTabItemCustom()

		// Проксируем событие close из TTabItemCustom на TTabItem.events
		this._customItem.events.on('close', () => {
			this.events.emit('close')
		})
	}

	// Проксирование свойств text, value, closable на _customItem

	get text(): string {
		return this._customItem.text
	}

	set text(value: string) {
		this._customItem.text = value
	}

	get value(): string | number {
		return this._customItem.value
	}

	set value(val: string | number) {
		this._customItem.value = val
	}

	get closable(): boolean | undefined {
		return this._customItem.closable
	}

	set closable(value: boolean | undefined) {
		this._customItem.closable = value
	}

	close(): void {
		this._customItem.close()
	}

	override getProps(): ITabItemProps {
		return {
			...super.getProps(),
			...this._customItem.getProps(),
			active: this.active,
		}
	}

	override assign(source: Partial<ITabItem>): void {
		if (source.text !== undefined) this.text = source.text
		if (source.value !== undefined) this.value = source.value
		if (source.closable !== undefined) this.closable = source.closable
		if (source.active !== undefined) this.active = source.active
	}

	override free(): void {
		super.free()
	}
}
