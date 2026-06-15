import type {
	IValueControl,
	IValueControlProps,
	TValueControlEvents,
	TValueControlStates,
} from '../../../base/value-control'
import type {
	ISelectableCollectionItemProps,
	TSelectableItemEvents,
} from '../../../base/collection/selectable/types'
import type { TCollectableOptions } from '../../../base/collection/item/types'
import type { IComponentViewOptions } from '../../../base/component-view'
import type { IStateUnit } from '../../../common/state-unit'
import type { TValuePayload } from '../../../common/types'

// ============ TListItemCustom (UI-логика без коллекции) ============

export type TListItemCustomEvents<TItem = any> = TValueControlEvents<string | number> & {
	/** change:text */
	'change:text': (payload: TValuePayload<string>) => void
	/** change:wordWrap */
	'change:wordWrap': (value: boolean) => void
}

export interface IListItemCustomProps extends IValueControlProps<string | number> {
	/** Текст элемента */
	text?: string
	/** Перенос текста (undefined = наследовать от TList) */
	wordWrap?: boolean
}

export type TListItemCustomStates = TValueControlStates<string | number> & {
	text: IStateUnit<string>
	wordWrap: IStateUnit<boolean | undefined>
}

export interface IListItemCustom<
	TProps extends IListItemCustomProps = IListItemCustomProps,
> extends IValueControl<string | number, TProps, TListItemCustomEvents<any>> {
	/** Текст элемента */
	text: string
	/** Перенос текста (undefined = наследовать от TList) */
	wordWrap: boolean | undefined
	/** Инжектирует резолвер wordWrap из TList */
	setWordWrapResolver(resolver: () => boolean): void
	/** Оповещает что родительский wordWrap изменился */
	notifyWordWrapChange(): void
}

// ============ TListItem (коллекционный элемент с композицией) ============

export type IListItemOptions = TCollectableOptions<
	IComponentViewOptions<IListItemProps, TListItemCustomStates>
>

export type TListItemEvents = TSelectableItemEvents<IListItem> &
	TListItemCustomEvents<IListItem>

export interface IListItemProps
	extends ISelectableCollectionItemProps,
		IListItemCustomProps {}

export interface IListItem
	extends IListItemCustom<IListItemProps>,
		ISelectableCollectionItemProps {
	collection: any | null
	toggleSelected(): void
	select(): void
	deselect(): void
	free(): void
}
