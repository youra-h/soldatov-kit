import { type IListBoxItem, type IListBoxItemProps } from '@core'
import {
	default as BaseListBoxItemCustom,
	emitsListBoxItemCustom,
	propsListBoxItemCustom,
	syncListBoxItemCustom,
	type IListBoxItemCustomState,
} from './list-box-item-custom.component'
import {
	emitsSelectableCollectionItem,
	syncSelectableCollectionItem,
	propsSelectableCollectionItem,
	type ISelectableCollectionItemState,
} from '../../collection/selectable'
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../../types'

export const emitsListBoxItem: TEmits = [
	...emitsListBoxItemCustom,
	...emitsSelectableCollectionItem,
] as const

export const propsListBoxItem: TProps = {
	...propsListBoxItemCustom,
	...propsSelectableCollectionItem,
}

export default {
	name: 'BaseListBoxItem',
	extends: BaseListBoxItemCustom,
	emits: emitsListBoxItem,
	props: propsListBoxItem,
}

export interface IListBoxItemState
	extends IListBoxItemCustomState, ISelectableCollectionItemState<IListBoxItem> {}

export function syncListBoxItem(
	options: ISyncComponentViewOptions<IListBoxItemProps, IListBoxItem>,
): IListBoxItemState {
	return {
		...syncListBoxItemCustom(options),
		...syncSelectableCollectionItem(options),
	}
}
