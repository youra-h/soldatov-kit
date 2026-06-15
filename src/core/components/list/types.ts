import type {
	IControl,
	IControlProps,
	TControlEvents,
	TControlStates,
} from '../../base/control'
import type {
	TSelectableCollection,
	TSelectableCollectionEvents,
	TSelectionMode,
	TItemProxyEvents,
} from '../../base/collection'
import type { IListItem } from './list-item/types'

export type TListEvents = TControlEvents &
	TSelectableCollectionEvents &
	TItemProxyEvents<IListItem> & {
		'item:text': (item: IListItem, value: string) => void
	}

export interface IListProps extends IControlProps {
	/** Режим выбора */
	mode?: TSelectionMode
}

export type TListStates = TControlStates

export interface IList extends IControl<IListProps, TListEvents> {
	/** Режим выбора */
	mode: TSelectionMode
	/** Выбранные элементы */
	readonly selected: IListItem[]
	/** Количество выбранных элементов */
	readonly selectedCount: number
	/** Доступ к коллекции элементов */
	readonly collection: TSelectableCollection<any, any, IListItem>
}
