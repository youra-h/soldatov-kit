import type { PropType } from 'vue'
import { type ITabItem, type ITabItemProps } from '@core'
import {
	default as BaseTabItemCustom,
	emitsTabItemCustom,
	propsTabItemCustom,
	syncTabItemCustom,
} from './tab-item-custom.component'
import {
	emitsActivatableCollectionItem,
	syncActivatableCollectionItem,
	propsActivatableCollectionItem,
} from '../../collection/activable'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../../types'

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

export interface ITabItemState extends IActivatableCollectionItemState<ITabItem> {}

/**
 * Синхронизация props и событий для TabItem
 */
export function syncTabItem(options: ISyncComponentModelOptions<ITabItemProps, ITabItem>) {
	return {
		...syncTabItemCustom(options),
		...syncActivatableCollectionItem(options),
	}
}
