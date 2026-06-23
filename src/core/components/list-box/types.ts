import type { IList, IListProps, TListEvents, TListStates } from '../list/types'
import type { TItemProxyEvents } from '../../base/collection'
import type { IListBoxItem } from './list-box-item/types'

export type TListBoxAppearance = 'plain' | 'outlined' | 'filled'

export type TListBoxEvents = TListEvents &
	TItemProxyEvents<IListBoxItem> & {
		/** change:appearance */
		'change:appearance': (value: TListBoxAppearance) => void
	}

export interface IListBoxProps extends IListProps {
	/** Внешний вид компонента */
	appearance?: TListBoxAppearance
}

export type TListBoxStates = TListStates

export interface IListBox extends IList<
	IListBoxItem,
	IListBoxProps,
	TListBoxEvents,
	TListBoxStates
> {
	/** Внешний вид компонента */
	appearance: TListBoxAppearance
}
