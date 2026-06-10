import type {
	IValueControl,
	IValueControlProps,
	TValueControlEvents,
	TValueControlStates,
} from '../../../base/value-control'
import type {
	ISelectableCollectionItem,
	ISelectableCollectionItemProps,
	TSelectableItemEvents,
} from '../../../base/collection/selectable/types'
import type { TCollectableOptions } from '../../../base/collection/item/types'
import type { IComponentViewOptions } from '../../../base/component-view'
import type { IStateUnit } from '../../../common/state-unit'
import type { TValuePayload } from '../../../common/types'
import type { TCollapseAppearance } from '../types'

// ============ TCollapseItemCustom (UI-логика без коллекции) ============

export type TCollapseArrowPlacement = 'start' | 'end'

export type TCollapseItemCustomEvents<TItem = any> = TValueControlEvents<string | number> & {
	/** change:text */
	'change:text': (payload: TValuePayload<string>) => void
	/** change:arrowPlacement */
	'change:arrowPlacement': (value: TCollapseArrowPlacement) => void
	/** change:appearance */
	'change:appearance': (value: TCollapseAppearance) => void
}

export interface ICollapseItemCustomProps extends IValueControlProps<string | number> {
	/** Текст заголовка элемента */
	text?: string
	/** Позиция иконки */
	arrowPlacement?: TCollapseArrowPlacement
}

export type TCollapseItemCustomStates = TValueControlStates<string | number> & {
	text: IStateUnit<string>
}

export interface ICollapseItemCustom<
	TProps extends ICollapseItemCustomProps = ICollapseItemCustomProps,
> extends IValueControl<string | number, TProps, TCollapseItemCustomEvents<any>> {
	/** Текст заголовка элемента */
	text: string
	/** Позиция иконки */
	arrowPlacement: TCollapseArrowPlacement
	/** Внешний вид (readonly, наследуется от TCollapse) */
	readonly appearance: TCollapseAppearance
	/** Инжектирует резолвер appearance из TCollapse */
	setAppearanceResolver(resolver: () => TCollapseAppearance): void
}

// ============ TCollapseItem (коллекционный элемент с композицией) ============

export type ICollapseItemOptions = TCollectableOptions<
	IComponentViewOptions<ICollapseItemProps, TCollapseItemCustomStates>
>

export type TCollapseItemEvents = TSelectableItemEvents<ICollapseItem> &
	TCollapseItemCustomEvents<ICollapseItem>

export interface ICollapseItemProps
	extends ISelectableCollectionItemProps,
		ICollapseItemCustomProps {}

export interface ICollapseItem
	extends ICollapseItemCustom<ICollapseItemProps>,
		ISelectableCollectionItemProps {
	collection: any | null
	toggleSelected(): void
	open(): void
	close(): void
	free(): void
}
