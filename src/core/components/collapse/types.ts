import type { IControl, IControlProps, TControlEvents, TControlStates } from '../../base/control'
import type {
	TSelectableCollection,
	TSelectableCollectionEvents,
	TSelectionMode,
	TItemProxyEvents,
	ISelectableCollectionProps,
} from '../../base/collection'
import type { ICollapseItem } from './collapse-item/types'

export type TCollapseAppearance = 'plain' | 'outlined' | 'filled'

export type TCollapseEvents = TControlEvents &
	TSelectableCollectionEvents &
	TItemProxyEvents<ICollapseItem> & {
		/** change:appearance */
		'change:appearance': (value: TCollapseAppearance) => void
		'item:text': (item: ICollapseItem, value: string) => void
	}

export interface ICollapseProps extends IControlProps, ISelectableCollectionProps {
	/** Внешний вид компонента */
	appearance?: TCollapseAppearance
}

export type TCollapseStates = TControlStates

export interface ICollapse extends IControl<ICollapseProps, TCollapseEvents> {
	/** Внешний вид компонента */
	appearance: TCollapseAppearance
	/** Режим выбора */
	mode: TSelectionMode
	/** Доступ к коллекции элементов */
	readonly collection: TSelectableCollection<any, any, ICollapseItem>
}
