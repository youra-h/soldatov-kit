import type { Ref } from 'vue'
import { type ICollapseItem, type ICollapseItemProps, type TCollapseAppearance } from '@core'
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
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../../types'
import { useSyncProps } from '../../../composables/useSyncProps'

export const emitsCollapseItem: TEmits = [
	...emitsCollapseItemCustom,
	...emitsSelectableCollectionItem,
] as const

export const propsCollapseItem: TProps = {
	...propsCollapseItemCustom,
	...propsSelectableCollectionItem,
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
	options: ISyncComponentModelOptions<ICollapseItemProps, ICollapseItem>,
): ICollapseItemState {
	const { instance } = options

	return {
		...syncCollapseItemCustom(options),
		...syncSelectableCollectionItem(options),
		...useSyncProps(instance.events as any, {
			appearance: () => instance.collection?.appearance,
		}),
	}
}
