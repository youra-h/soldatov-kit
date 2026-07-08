import type { PropType, Ref } from 'vue'
import { type IListBoxItem, type IListItemProps, type TListBoxView } from '@core'
import {
	BaseListItem,
	emitsListItem,
	propsListItem,
	syncListItem,
	type IListItemState,
} from '../../list/list-item'
import type { TEmits, TProps, ISyncComponentOptions } from '../../../types'
import { useSyncProps } from '../../../composables/useSyncProps'
import { TListItemPlugin } from '@plugins'

export const emitsListBoxItem: TEmits = [...emitsListItem] as const

export const propsListBoxItem: TProps = {
	...propsListItem,
	view: {
		type: String as PropType<TListBoxView>,
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
	view: Ref<TListBoxView>
	highlighted: Ref<boolean>
}

export function syncListBoxItem(
	options: ISyncComponentOptions<IListItemProps, IListBoxItem>,
): IListBoxItemState {
	const syncProps = syncListItem(options)

	const { instance, plugins } = options

	const itemPlugin = plugins.get(TListItemPlugin)!

	return {
		...syncProps,
		...useSyncProps(instance.events as any, {
			view: () => instance.view,
		}),
		...useSyncProps(itemPlugin.events, {
			highlighted: () => itemPlugin.highlighted,
		}),
	}
}
