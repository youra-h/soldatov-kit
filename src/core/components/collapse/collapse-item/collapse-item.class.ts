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
 * Переопределяет сеттер selected, чтобы использовать класс --open вместо стандартного --selected.
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

	override get selected(): boolean {
		return this._collectionItem.selected
	}

	override set selected(value: boolean) {
		if (value && this.disabled) return
		this._collectionItem.selected = value
		this._classes.toggle('--open', value)
	}

	override click(event?: Event): void {
		if (!this.disabled) {
			this.toggleSelected()
		}
		super.click(event)
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
