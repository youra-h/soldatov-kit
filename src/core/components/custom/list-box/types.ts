import type { IList, IListProps, TListEvents, TListStates } from '../list/types'
import type { TItemProxyEvents } from '../../base/collection'
import type { IListBoxItem } from './list-box-item/types'

export type TListBoxView = 'plain' | 'outlined' | 'filled'

export type TListBoxEvents = TListEvents &
	TItemProxyEvents<IListBoxItem> & {
		/** change:view */
		'change:view': (value: TListBoxView) => void
	}

export interface IListBoxProps<
	TItem extends IListBoxItem = IListBoxItem,
> extends IListProps<TItem> {
	/** Внешний вид компонента */
	view?: TListBoxView
}

export type TListBoxStates = TListStates

export interface IListBox extends IList<
	IListBoxItem,
	IListBoxProps,
	TListBoxEvents,
	TListBoxStates
> {
	/** Внешний вид компонента */
	view: TListBoxView
}
