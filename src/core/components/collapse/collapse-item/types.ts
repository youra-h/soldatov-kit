import type {
	IValueControl,
	IValueControlProps,
	TValueControlEvents,
	TValueControlStatesOptions,
} from '../../../base/value-control'
import type {
	ISelectableCollectionItem,
	ISelectableCollectionItemProps,
	TSelectableItemEvents,
} from '../../../base/collection/selectable/types'
import type { TCollectableOptions } from '../../../base/collection/item/types'
import type { IComponentViewOptions } from '../../../base/component-view'

export type TCollapseItemEvents = TValueControlEvents<string | number> &
	TSelectableItemEvents<ICollapseItem> & {
		free: (item: ICollapseItem) => void
		'change:order': (value: number) => void
	}

export interface ICollapseItemProps
	extends ISelectableCollectionItemProps,
		IValueControlProps<string | number> {}

export type ICollapseItemOptions = TCollectableOptions<
	IComponentViewOptions<ICollapseItemProps, TValueControlStatesOptions<string | number>>
>

export interface ICollapseItem
	extends IValueControl<string | number, ICollapseItemProps, TCollapseItemEvents>,
		ISelectableCollectionItemProps {
	collection: any | null
	toggleSelected(): void
	open(): void
	close(): void
	free(): void
}
