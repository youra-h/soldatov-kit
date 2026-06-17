import type { PropType, Ref } from 'vue'
import { type IListBoxItem, type IListItemProps, type TListBoxAppearance } from '@core'
import {
	BaseListItem,
	emitsListItem,
	propsListItem,
	syncListItem,
	type IListItemState,
} from '../../list/list-item'
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../../types'
import { useSyncProps } from '../../../composables/useSyncProps'

export const emitsListBoxItem: TEmits = [...emitsListItem] as const

export const propsListBoxItem: TProps = {
	...propsListItem,
	appearance: {
		type: String as PropType<TListBoxAppearance>,
		default: 'plain',
	},
}

export default {
	name: 'BaseListBoxItem',
	extends: BaseListItem,
	emits: emitsListBoxItem,
	props: propsListBoxItem,
}

export interface IListBoxItemState extends IListItemState {
	appearance: Ref<TListBoxAppearance>
}

export function syncListBoxItem(
	options: ISyncComponentViewOptions<IListItemProps, IListBoxItem>,
): IListBoxItemState {
	const syncProps = syncListItem(options)

	const { instance } = options

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			appearance: () => instance.appearance,
		}),
	}
}
