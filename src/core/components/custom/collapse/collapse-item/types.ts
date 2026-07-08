import type {
	IValueControl,
	IValueControlProps,
	TValueControlEvents,
	TValueControlStates,
} from '../../../base/value-control'
import type {
	ISelectableCollectionItemProps,
	TSelectableItemEvents,
	ISelectableComponentItem,
} from '../../../base/collection'
import type { TCollectableOptions } from '../../../base/collection'
import type { IComponentViewOptions } from '../../../base/component-view'
import type { IStateUnit } from '../../../../common'
import type { TValuePayload } from '../../../../bridge'
import type { TCollapseView } from '../types'

// ============ TCollapseItemCustom (UI-логика без коллекции) ============

export type TCollapseArrowPlacement = 'start' | 'end'

export type TCollapseItemCustomEvents<TItem = any> = TValueControlEvents<string | number> & {
	/** change:text */
	'change:text': (payload: TValuePayload<string>) => void
	/** change:arrowPlacement */
	'change:arrowPlacement': (value: TCollapseArrowPlacement) => void
	/** change:view */
	'change:view': (value: TCollapseView) => void
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
	readonly view: TCollapseView
	/** Инжектирует резолвер view из TCollapse */
	setViewResolver(resolver: () => TCollapseView): void
}

// ============ TCollapseItem (коллекционный элемент с композицией) ============

export type TCollapseItemOptions = TCollectableOptions<
	IComponentViewOptions<ICollapseItemProps, TCollapseItemCustomStates>
>

export type TCollapseItemEvents = TSelectableItemEvents<ICollapseItem> &
	TCollapseItemCustomEvents<ICollapseItem>

export interface ICollapseItemProps
	extends ISelectableCollectionItemProps, ICollapseItemCustomProps {}

export interface ICollapseItem
	extends ICollapseItemCustom<ICollapseItemProps>, ISelectableComponentItem {
	open(): void
	close(): void
}
