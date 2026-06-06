import type {
	IControl,
	IControlProps,
	TControlEvents,
	TControlStatesOptions,
} from '../../base/control'
import type {
	TSelectableCollection,
	TSelectableCollectionEvents,
	TSelectionMode,
	TItemProxyEvents,
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

export interface ICollapseProps extends IControlProps {
	/** Внешний вид компонента */
	appearance?: TCollapseAppearance
	/** Режим выбора */
	mode?: TSelectionMode
}

export type TCollapseStatesOptions = TControlStatesOptions

export interface ICollapse extends IControl<ICollapseProps, TCollapseEvents> {
	/** Внешний вид компонента */
	appearance: TCollapseAppearance
	/** Режим выбора */
	mode: TSelectionMode
	/** Выбранные элементы */
	readonly selected: ICollapseItem[]
	/** Количество выбранных элементов */
	readonly selectedCount: number
	/** Доступ к коллекции элементов */
	readonly collection: TSelectableCollection<any, any, ICollapseItem>
}
