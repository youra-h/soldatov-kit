import { SelectableComponentMixin } from '../../../base/collection'
import TListItemCustom from './list-item-custom.class'
import type {
	IListItem,
	TListItemOptions,
	IListItemProps,
	TListItemEvents,
} from './types'

export default class TListItem
	extends SelectableComponentMixin(TListItemCustom<IListItemProps, TListItemEvents>)
	implements IListItem
{
	constructor(options: TListItemOptions | Partial<IListItemProps> = {}) {
		const { collection, ...componentOptions } = options as TListItemOptions

		super(componentOptions)

		this._initSelectableComposition(collection)
	}

	override getProps(): IListItemProps {
		return {
			...super.getProps(),
			selected: this.selected,
			order: this.order,
			wordWrap: this.wordWrap,
		}
	}

	override assign(source: Partial<IListItem>): void {
		super.assign(source)

		if (source.selected !== undefined) this.selected = source.selected
	}
}
