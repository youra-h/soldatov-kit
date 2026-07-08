import type {
	IListItem,
	TListItemOptions,
	IListItemProps,
	TListItemEvents,
	TListItemCustomStates,
} from '../../list'
import type { TListBoxView } from '../types'

export type TListBoxItemEvents = TListItemEvents & {
	/** change:view */
	'change:view': (value: TListBoxView) => void
}

export type TListBoxItemStates = TListItemCustomStates

export interface IListBoxItemProps extends IListItemProps {}

export type TListBoxItemOptions = TListItemOptions<IListBoxItemProps, TListBoxItemStates>

export interface IListBoxItem extends IListItem<IListBoxItemProps, TListBoxItemEvents> {
	/** Внешний вид (readonly, наследуется от TListBox) */
	readonly view: TListBoxView
	/** Инжектирует резолвер view из TListBox */
	setViewResolver(resolver: () => TListBoxView): void
}
