import type { PropType } from 'vue'
import { watch } from 'vue'
import { type ITabItem, type ITabItemProps, TTabItem } from '../../../../core'
import {
	BaseTabItemCustom,
	emitsTabItemCustom,
	propsTabItemCustom,
	syncTabItemCustom,
} from './tab-item-custom.component'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../../types'

export const emitsTabItem: TEmits = [
	...emitsTabItemCustom,
	'change',
	'change:active',
	'update:active',
	'active',
	'free',
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

	const { props, instance, emit } = options

	// Пробрасываем события коллекции наружу (Vue events)
	instance.events.on('change', (item: ITabItem) => {
		emit?.('change', item)
		emit?.('change:active', instance.active)
		emit?.('active', instance.active)
		emit?.('update:active', instance.active)
	})

	instance.events.on('free', (item: ITabItem) => {
		emit?.('free', item)
	})

	watch<boolean | undefined>(
		() => props.active,
		(value) => {
			if (value !== undefined && value !== instance.active) {
				instance.active = value
			}
		},
	)
}
