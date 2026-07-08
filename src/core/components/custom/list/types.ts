import type { IControl, IControlProps, TControlEvents, TControlStates } from '../../base/control'
import type {
	TSelectableCollection,
	TSelectableCollectionEvents,
	TSelectionMode,
	TItemProxyEvents,
	ISelectableCollectionProps,
} from '../../base/collection'
import type { IListItem } from './list-item/types'
import type { TScrollBehavior } from '../../../bridge'

export type TListEvents = TControlEvents &
	TSelectableCollectionEvents<IListItem> &
	TItemProxyEvents<IListItem> & {
		/** change:maxRows */
		'change:maxRows': (value: number) => void
		/** change:autoWidth */
		'change:autoWidth': (value: boolean) => void
		/** change:wordWrap */
		'change:wordWrap': (value: boolean) => void
		/** change:scrollBehavior */
		'change:scrollBehavior': (value: TScrollBehavior) => void
		'item:text': (item: IListItem, value: string) => void
		'item:rendered': (item: IListItem, value: boolean) => void
		'item:visible': (item: IListItem, value: boolean) => void
		'item:present': (item: IListItem, value: boolean) => void
	}

export interface IListProps<
	TItem extends IListItem = IListItem,
> extends IControlProps, ISelectableCollectionProps<TItem> {
	/** Максимальное количество видимых строк (0 = без ограничений) */
	maxRows?: number
	/** Ширина бокса определяется по самому длинному тексту */
	autoWidth?: boolean
	/** Перенос текста на новую строку (false = троеточие) */
	wordWrap?: boolean
	/** Поведение скролла при выделении элемента */
	scrollBehavior?: TScrollBehavior
}

export type TListStates = TControlStates

export interface IList<
	TItem extends IListItem = IListItem,
	TProps extends IListProps = IListProps,
	TEvents extends TListEvents = TListEvents,
	TStates extends TListStates = TListStates,
> extends IControl<TProps, TEvents, TStates> {
	/** Режим выбора */
	mode: TSelectionMode
	/** Максимальное количество видимых строк (0 = без ограничений) */
	maxRows: number
	/** Ширина бокса определяется по самому длинному тексту */
	autoWidth: boolean
	/** Перенос текста на новую строку (false = троеточие) */
	wordWrap: boolean
	/** Поведение скролла при выделении элемента */
	scrollBehavior: TScrollBehavior
	/** Доступ к коллекции элементов */
	readonly collection: TSelectableCollection<any, any, TItem>
	/** Возвращает количество видимых элементов в списке */
	getVisibleItemCount(): number
}
