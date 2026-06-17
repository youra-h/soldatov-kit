import type {
	IListItemCustom,
	IListItemCustomProps,
	TListItemCustomEvents,
	TListItemCustomStates,
} from '../../list/list-item/types'
import type { TValuePayload } from '../../../common/types'
import type { TListBoxAppearance } from '../types'
import type { TCollectableOptions } from '../../../base/collection/item/types'
import type { IComponentViewOptions } from '../../../base/component-view'
import type { ISelectableCollectionItemProps, TSelectableItemEvents } from '../../../base/collection/selectable/types'

// ============ TListBoxItemCustom (UI-логика без коллекции) ============

export type TListBoxItemCustomEvents<TItem = any> = TListItemCustomEvents<TItem> & {
	/** change:appearance */
	'change:appearance': (value: TListBoxAppearance) => void
}

export interface IListBoxItemCustomProps extends IListItemCustomProps {}

export type TListBoxItemCustomStates = TListItemCustomStates

export interface IListBoxItemCustom<
	TProps extends IListBoxItemCustomProps = IListBoxItemCustomProps,
> extends IListItemCustom<TProps> {
	/** Внешний вид (readonly, наследуется от TListBox) */
	readonly appearance: TListBoxAppearance
	/** Инжектирует резолвер appearance из TListBox */
	setAppearanceResolver(resolver: () => TListBoxAppearance): void
}

// ============ TListBoxItem (коллекционный элемент с композицией) ============

export type IListBoxItemOptions = TCollectableOptions<
	IComponentViewOptions<IListBoxItemProps, TListBoxItemCustomStates>
>

export type TListBoxItemEvents = TSelectableItemEvents<IListBoxItem> &
	TListBoxItemCustomEvents<IListBoxItem>

export interface IListBoxItemProps
	extends ISelectableCollectionItemProps,
		IListBoxItemCustomProps {}

export interface IListBoxItem
	extends IListBoxItemCustom<IListBoxItemProps>,
		ISelectableCollectionItemProps {
	collection: any | null
	toggleSelected(): void
	select(): void
	deselect(): void
	free(): void
}
