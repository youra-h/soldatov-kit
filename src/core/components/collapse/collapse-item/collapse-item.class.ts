import { SelectableComponentMixin } from '../../../base/collection'
import TCollapseItemCustom from './collapse-item-custom.class'
import type {
	ICollapseItem,
	TCollapseItemOptions,
	ICollapseItemProps,
	TCollapseItemEvents,
} from './types'

/**
 * Элемент collapse для работы в коллекции.
 * Архитектура: наследование от TCollapseItemCustom (UI-компонент) + SelectableComponentMixin (логика коллекции).
 */
export default class TCollapseItem
	extends SelectableComponentMixin(TCollapseItemCustom<ICollapseItemProps, TCollapseItemEvents>)
	implements ICollapseItem
{
	constructor(options: TCollapseItemOptions | Partial<ICollapseItemProps> = {}) {
		const { collection, ...componentOptions } = options as TCollapseItemOptions

		super(componentOptions)

		this._initSelectableComposition(collection)
	}

	open(): void {
		this.selected = true
	}

	close(): void {
		this.selected = false
	}

	override getProps(): ICollapseItemProps {
		return {
			...super.getProps(),
			selected: this.selected,
			order: this.order,
		}
	}

	override assign(source: Partial<ICollapseItem>): void {
		super.assign(source)

		if (source.selected !== undefined) this.selected = source.selected
	}
}
