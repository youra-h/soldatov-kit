import { type IListItem, type IListItemProps } from '@core'
import {
	default as BaseListItemCustom,
	emitsListItemCustom,
	propsListItemCustom,
	syncListItemCustom,
	type IListItemCustomState,
} from './list-item-custom.component'
import {
	emitsSelectableCollectionItem,
	syncSelectableCollectionItem,
	propsSelectableCollectionItem,
	type ISelectableCollectionItemState,
} from '../../collection/selectable'
import type { TEmits, TProps, ISyncComponentOptions } from '../../../types'

export const emitsListItem: TEmits = [
	...emitsListItemCustom,
	...emitsSelectableCollectionItem,
] as const

export const propsListItem: TProps = {
	...propsListItemCustom,
	...propsSelectableCollectionItem,
}

export default {
	name: 'BaseListItem',
	extends: BaseListItemCustom,
	emits: emitsListItem,
	props: propsListItem,
}

export interface IListItemState
	extends IListItemCustomState, ISelectableCollectionItemState<IListItem> {}

export function syncListItem(
	options: ISyncComponentOptions<IListItemProps, IListItem>,
): IListItemState {
	return {
		...syncListItemCustom(options),
		...syncSelectableCollectionItem(options),
	}
}
