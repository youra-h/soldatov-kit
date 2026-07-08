import type { IControl, IControlProps, TControlEvents, TControlStates } from '../../base/control'
import type {
	TSelectableCollection,
	TSelectableCollectionEvents,
	TSelectionMode,
	TItemProxyEvents,
	ISelectableCollectionProps,
} from '../../base/collection'
import type { ICollapseItem } from './collapse-item/types'

export type TCollapseView = 'plain' | 'outlined' | 'filled'

export type TCollapseEvents = TControlEvents &
	TSelectableCollectionEvents &
	TItemProxyEvents<ICollapseItem> & {
		/** change:view */
		'change:view': (value: TCollapseView) => void
		'item:text': (item: ICollapseItem, value: string) => void
		'item:rendered': (item: ICollapseItem, value: boolean) => void
		'item:visible': (item: ICollapseItem, value: boolean) => void
		'item:present': (item: ICollapseItem, value: boolean) => void
	}

export interface ICollapseProps<
	TItem extends ICollapseItem = ICollapseItem,
> extends IControlProps, ISelectableCollectionProps<TItem> {
	/** Внешний вид компонента */
	view?: TCollapseView
}

export type TCollapseStates = TControlStates

export interface ICollapse extends IControl<ICollapseProps, TCollapseEvents> {
	/** Внешний вид компонента */
	view: TCollapseView
	/** Режим выбора */
	mode: TSelectionMode
	/** Доступ к коллекции элементов */
	readonly collection: TSelectableCollection<any, any, ICollapseItem>
}
