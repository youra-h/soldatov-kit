import type {
	IListItem,
	TListItemOptions,
	IListItemProps,
	TListItemEvents,
	TListItemCustomStates,
} from '../../list/list-item/types'
import type { TListBoxAppearance } from '../types'

export type TListBoxItemEvents = TListItemEvents & {
	/** change:appearance */
	'change:appearance': (value: TListBoxAppearance) => void
}

export type TListBoxItemStates = TListItemCustomStates

export interface IListBoxItemProps extends IListItemProps {}

export type TListBoxItemOptions = TListItemOptions<IListBoxItemProps, TListBoxItemStates>

export interface IListBoxItem extends IListItem<IListBoxItemProps, TListBoxItemEvents> {
	/** Внешний вид (readonly, наследуется от TListBox) */
	readonly appearance: TListBoxAppearance
	/** Инжектирует резолвер appearance из TListBox */
	setAppearanceResolver(resolver: () => TListBoxAppearance): void
}
