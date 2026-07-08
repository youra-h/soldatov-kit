import type { PropType, Ref } from 'vue'
import {
	type ICollapse,
	type ICollapseItem,
	type ICollapseItemProps,
	type TCollapseView,
} from '@core'
import {
	default as BaseCollapseItemCustom,
	emitsCollapseItemCustom,
	propsCollapseItemCustom,
	syncCollapseItemCustom,
	type ICollapseItemCustomState,
} from './collapse-item-custom.component'
import {
	emitsSelectableCollectionItem,
	syncSelectableCollectionItem,
	propsSelectableCollectionItem,
	type ISelectableCollectionItemState,
} from '../../collection/selectable'
import type { TEmits, TProps, ISyncComponentOptions } from '../../../types'

export const emitsCollapseItem: TEmits = [
	...emitsCollapseItemCustom,
	...emitsSelectableCollectionItem,
] as const

export const propsCollapseItem: TProps = {
	...propsCollapseItemCustom,
	...propsSelectableCollectionItem,
	view: {
		type: String as PropType<ICollapse['view']>,
		default: 'plain',
	},
}

export default {
	name: 'BaseCollapseItem',
	extends: BaseCollapseItemCustom,
	emits: emitsCollapseItem,
	props: propsCollapseItem,
}

export interface ICollapseItemState
	extends ICollapseItemCustomState, ISelectableCollectionItemState<ICollapseItem> {
	view: Ref<TCollapseView>
}

export function syncCollapseItem(
	options: ISyncComponentOptions<ICollapseItemProps, ICollapseItem>,
): ICollapseItemState {
	return {
		...syncCollapseItemCustom(options),
		...syncSelectableCollectionItem(options),
	}
}
