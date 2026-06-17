import TListItemCustom from '../../list/list-item/list-item-custom.class'
import type { IComponentViewOptions } from '../../../base/component-view'
import { TComponentView } from '../../../base/component-view'
import type {
	IListBoxItemCustom,
	IListBoxItemCustomProps,
	TListBoxItemCustomEvents,
	TListBoxItemCustomStates,
} from './types'
import type { TListBoxAppearance } from '../types'

export default class TListBoxItemCustom<
	TProps extends IListBoxItemCustomProps = IListBoxItemCustomProps,
	TEvents extends TListBoxItemCustomEvents<any> = TListBoxItemCustomEvents,
>
	extends TListItemCustom<TProps, TEvents, TListBoxItemCustomStates>
	implements IListBoxItemCustom<TProps>
{
	static override baseClass = 's-list-box-item'

	private _appearanceResolver: (() => TListBoxAppearance) | undefined

	constructor(
		options:
			| IComponentViewOptions<TProps, TListBoxItemCustomStates>
			| Partial<TProps> = {},
	) {
		super(options)
	}

	/** Инжектируется из TListBox при добавлении элемента в коллекцию */
	setAppearanceResolver(resolver: () => TListBoxAppearance): void {
		this._appearanceResolver = resolver
	}

	get appearance(): TListBoxAppearance {
		return this._appearanceResolver?.() ?? 'plain'
	}

	override getProps(): TProps {
		return {
			...super.getProps(),
			appearance: this.appearance,
		} as TProps
	}
}
