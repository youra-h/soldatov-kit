import type { PropType, Ref } from 'vue'
import {
	type ICollapse,
	type ICollapseItem,
	type ICollapseItemProps,
	type TCollapseAppearance,
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
import type { TEmits, TProps, ISyncComponentViewOptions } from '../../../types'

export const emitsCollapseItem: TEmits = [
	...emitsCollapseItemCustom,
	...emitsSelectableCollectionItem,
] as const

export const propsCollapseItem: TProps = {
	...propsCollapseItemCustom,
	...propsSelectableCollectionItem,
	appearance: {
		type: String as PropType<ICollapse['appearance']>,
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
	appearance: Ref<TCollapseAppearance>
}

export function syncCollapseItem(
	options: ISyncComponentViewOptions<ICollapseItemProps, ICollapseItem>,
): ICollapseItemState {
	return {
		...syncCollapseItemCustom(options),
		...syncSelectableCollectionItem(options),
	}
}
