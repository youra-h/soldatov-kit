import type { IControl, IControlProps, TControlEvents, TControlStates } from '../../base/control'
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
		/** change:maxRows */
		'change:maxRows': (value: number) => void
		/** change:autoWidth */
		'change:autoWidth': (value: boolean) => void
		/** change:wordWrap */
		'change:wordWrap': (value: boolean) => void
		'item:text': (item: IListItem, value: string) => void
	}

export interface IListProps extends IControlProps {
	/** Режим выбора */
	mode?: TSelectionMode
	/** Максимальное количество видимых строк (0 = без ограничений) */
	maxRows?: number
	/** Ширина бокса определяется по самому длинному тексту */
	autoWidth?: boolean
	/** Перенос текста на новую строку (false = троеточие) */
	wordWrap?: boolean
}

export type TListStates = TControlStates

export interface IList<
	TProps extends IListProps = IListProps,
	TEvents extends TListEvents = TListEvents,
	TStates extends TListStates = TListStates,
	TItem extends IListItem = IListItem,
> extends IControl<TProps, TEvents, TStates> {
	/** Режим выбора */
	mode: TSelectionMode
	/** Максимальное количество видимых строк (0 = без ограничений) */
	maxRows: number
	/** Ширина бокса определяется по самому длинному тексту */
	autoWidth: boolean
	/** Перенос текста на новую строку (false = троеточие) */
	wordWrap: boolean
	/** Доступ к коллекции элементов */
	readonly collection: TSelectableCollection<any, any, TItem>
}
