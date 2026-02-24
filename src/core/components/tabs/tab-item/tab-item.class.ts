import { TActivatableCollectionItem } from '../../../base/collection/activable/activable-collection-item.class'
import type { TCollection } from '../../../base/collection'
import TTabItemCustom from './tab-item-custom.class'
import type { ITabItem, ITabItemProps, TTabItemEvents } from './types'

/**
 * Элемент таба для работы в коллекции.
 * Архитектура: наследование от TTabItemCustom (UI-компонент) + композиция TActivatableCollectionItem (логика коллекции).
 *
 * Преимущества:
 * - Все UI-события автоматически доступны (change:visible, change:text и т.д.)
 * - Нужно проксировать только свойства/события коллекции (active, collection, change, free)
 * - Generic TProps=ITabItemProps обеспечивает правильные типы для getProps()/toJSON()
 */
export default class TTabItem
	extends TTabItemCustom<ITabItemProps, TTabItemEvents>
	implements ITabItem
{
	protected _collectionItem: TActivatableCollectionItem

	constructor(collection?: TCollection) {
		super()

		// Создаем элемент коллекции (у него свои Props, а не ITabItemProps!)
		this._collectionItem = new TActivatableCollectionItem(collection)

		// Проксируем события коллекции на this.events
		this._collectionItem.events.on('change:activation', () => {
			this.events.emit('change:activation', this)
		})
		this._collectionItem.events.on('free', () => {
			this.events.emit('free', this)
		})
	}

	// Проксирование свойств коллекции

	get collection(): TCollection | null {
		return this._collectionItem.collection
	}

	set collection(value: TCollection | null) {
		this._collectionItem.collection = value
	}

	get active(): boolean {
		return this._collectionItem.active
	}

	set active(value: boolean) {
		this._collectionItem.active = value
	}

	toggleActive(): void {
		this._collectionItem.toggleActive()
	}

	override getProps(): ITabItemProps {
		return {
			...super.getProps(), // Все UI-свойства от TTabItemCustom
			active: this.active, // Добавляем active из _collectionItem
		}
	}

	override assign(source: Partial<ITabItem>): void {
		super.assign(source)

		if (source.active !== undefined) this.active = source.active
	}

	free(): void {
		this._collectionItem.free()
	}
}
