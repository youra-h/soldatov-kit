import { ActivatableComponentMixin } from '../../../base/collection'
import TTabItemCustom from './tab-item-custom.class'
import type { ITabItem, TTabItemOptions, ITabItemProps, TTabItemEvents } from './types'

/**
 * Элемент таба для работы в коллекции.
 * Архитектура: наследование от TTabItemCustom (UI-компонент) + ActivatableComponentMixin (логика коллекции).
 */
export default class TTabItem
	extends ActivatableComponentMixin(TTabItemCustom<ITabItemProps, TTabItemEvents>)
	implements ITabItem
{
	constructor(options: TTabItemOptions | Partial<ITabItemProps> = {}) {
		const { collection, ...componentOptions } = options as TTabItemOptions

		super(componentOptions)

		this._initActivatableComposition(collection)
	}

	override getProps(): ITabItemProps {
		return {
			...super.getProps(),
			active: this.active,
			order: this.order,
		}
	}

	override assign(source: Partial<ITabItem>): void {
		super.assign(source)

		if (source.active !== undefined) this.active = source.active
	}
}
