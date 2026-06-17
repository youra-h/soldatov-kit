import type {
	IListItem,
	IListItemCustomProps,
	TListItemCustomEvents,
} from '../../list/list-item/types'
import type { TListBoxAppearance } from '../types'
import type { TCollectableOptions } from '../../../base/collection/item/types'
import type { IComponentViewOptions } from '../../../base/component-view'
import type {
	ISelectableCollectionItemProps,
	TSelectableItemEvents,
} from '../../../base/collection/selectable/types'

export type TListBoxItemCustomEvents<TItem = any> = TListItemCustomEvents<TItem> & {
	/** change:appearance */
	'change:appearance': (value: TListBoxAppearance) => void
}

export interface IListBoxItemCustomProps extends IListItemCustomProps {}

export type IListBoxItemOptions = TCollectableOptions<
	IComponentViewOptions<IListBoxItemProps, any>
>

export type TListBoxItemEvents = TSelectableItemEvents<IListBoxItem> &
	TListBoxItemCustomEvents<IListBoxItem>

export interface IListBoxItemProps
	extends ISelectableCollectionItemProps, IListBoxItemCustomProps {}

export interface IListBoxItem extends IListItem {
	/** Внешний вид (readonly, наследуется от TListBox) */
	readonly appearance: TListBoxAppearance
	/** Инжектирует резолвер appearance из TListBox */
	setAppearanceResolver(resolver: () => TListBoxAppearance): void
}
