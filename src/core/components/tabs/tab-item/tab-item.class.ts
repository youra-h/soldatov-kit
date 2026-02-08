import { TActivatableCollectionItem } from '../../../base/collection/activable/activable-collection-item.class'
import type { TCollection } from '../../../base/collection'
import TTabItemCustom from './tab-item-custom.class'
import type { ITabItem, ITabItemProps, TTabItemEvents } from './types'

/**
 * Элемент таба для работы в коллекции.
 * Композиция: TActivatableCollectionItem + TTabItemCustom.
 */
export default class TTabItem extends TActivatableCollectionItem<ITabItemProps> implements ITabItem {
	protected _customItem: TTabItemCustom

	constructor(collection?: TCollection) {
		super(collection)

		// Создаем кастомный элемент таба
		this._customItem = new TTabItemCustom()
	}

	// Проксирование свойств text, value, badge, closable на _customItem

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

	get badge(): string | number | undefined {
		return this._customItem.badge
	}

	set badge(value: string | number | undefined) {
		this._customItem.badge = value
	}

	get closable(): boolean {
		return this._customItem.closable
	}

	set closable(value: boolean) {
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
		if (source.badge !== undefined) this.badge = source.badge
		if (source.closable !== undefined) this.closable = source.closable
		if (source.active !== undefined) this.active = source.active
	}

	override free(): void {
		super.free()
		// Дополнительная очистка если нужно
	}
}
