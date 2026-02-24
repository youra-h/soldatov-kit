import type { PropType } from 'vue'
import { watch } from 'vue'
import {
	type ISelectableCollectionItem,
	type ISelectableCollectionItemProps,
	TSelectableCollectionItem
} from '../../../../core'
import {
	BaseCollectionItem,
	emitsCollectionItem,
	propsCollectionItem,
	syncCollectionItem,
} from '../item'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../../types'

export const emitsSelectableCollectionItem: TEmits = [
	...emitsCollectionItem,
	'change:selection',
	'update:selected',
] as const

export const propsSelectableCollectionItem: TProps = {
	...propsCollectionItem,
	selected: {
		type: Boolean as PropType<ISelectableCollectionItemProps['selected']>,
		default: TSelectableCollectionItem.defaultValues.selected,
	},
}

export default {
	name: 'BaseSelectableCollectionItem',
	extends: BaseCollectionItem,
	emits: emitsSelectableCollectionItem,
	props: propsSelectableCollectionItem,
}

/**
 * Синхронизация props и событий для SelectableCollectionItem
 */
export function syncSelectableCollectionItem(
	options: ISyncComponentModelOptions<
		ISelectableCollectionItemProps,
		ISelectableCollectionItem
	>,
) {
	syncCollectionItem(options)

	const { props, instance, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on('change:selection', (item: ISelectableCollectionItem) => {
		emit?.('change:selection', item)
		emit?.('update:selected', instance.selected)
	})

	watch<boolean | undefined>(
		() => props.selected,
		(value) => {
			if (value !== undefined && value !== instance.selected) {
				instance.selected = value
			}
		},
	)
}
