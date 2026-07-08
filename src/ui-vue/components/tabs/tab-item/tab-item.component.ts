import type { PropType } from 'vue'
import { type ITabItem, type ITabItemProps } from '@core'
import {
	default as BaseTabItemCustom,
	emitsTabItemCustom,
	propsTabItemCustom,
	syncTabItemCustom,
	type ITabItemCustomState,
} from './tab-item-custom.component'
import {
	emitsActivatableCollectionItem,
	syncActivatableCollectionItem,
	propsActivatableCollectionItem,
	type IActivatableCollectionItemState,
} from '../../collection/activable'
import type { TEmits, TProps, ISyncComponentOptions } from '../../../types'

export const emitsTabItem: TEmits = [
	...emitsTabItemCustom,
	...emitsActivatableCollectionItem,
] as const

export const propsTabItem: TProps = {
	...propsTabItemCustom,
	...propsActivatableCollectionItem,
}

export default {
	name: 'BaseTabItem',
	extends: BaseTabItemCustom,
	emits: emitsTabItem,
	props: propsTabItem,
}

export interface ITabItemState
	extends ITabItemCustomState, IActivatableCollectionItemState<ITabItem> {}

/**
 * Синхронизация props и событий для TabItem
 */
export function syncTabItem(options: ISyncComponentOptions<ITabItemProps, ITabItem>) {
	return {
		...syncTabItemCustom(options),
		...syncActivatableCollectionItem(options),
	}
}
