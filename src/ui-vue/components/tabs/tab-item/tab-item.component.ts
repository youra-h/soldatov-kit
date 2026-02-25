import type { PropType } from 'vue'
import { type ITabItem, type ITabItemProps } from '../../../../core'
import {
	default as BaseTabItemCustom,
	emitsTabItemCustom,
	propsTabItemCustom,
	syncTabItemCustom,
} from './tab-item-custom.component'
import { emitsActivatableCollectionItem, syncActivatableCollectionItem } from '../../collection/activable'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../../types'

export const emitsTabItem: TEmits = [
	...emitsTabItemCustom,
	...emitsActivatableCollectionItem
] as const

export const propsTabItem: TProps = {
	...propsTabItemCustom,
	active: {
		type: Boolean as PropType<ITabItemProps['active']>,
		default: false,
	},
}

export default {
	name: 'BaseTabItem',
	extends: BaseTabItemCustom,
	emits: emitsTabItem,
	props: propsTabItem,
}

/**
 * Синхронизация props и событий для TabItem
 */
export function syncTabItem(
	options: ISyncComponentModelOptions<ITabItemProps, ITabItem>,
) {
	syncTabItemCustom(options)
	syncActivatableCollectionItem(options)
}
