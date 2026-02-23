import type { PropType } from 'vue'
import { watch } from 'vue'
import {
	type ISelectableCollection,
	type ISelectableCollectionProps,
	type ISelectableCollectionItem,
	type TSelectionMode,
	TSelectableCollection,
} from '../../../../core'
import {
	default as BaseCollection,
	emitsCollection,
	propsCollection,
	syncCollection,
} from '../base.component'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../../types'

export const emitsSelectableCollection: TEmits = [
	...emitsCollection,
	'change',
	'change:selected',
	'change:mode',
	'update:mode',
	'change:selectedCount',
] as const

export const propsSelectableCollection: TProps = {
	...propsCollection,
	mode: {
		type: String as PropType<TSelectionMode>,
		default: TSelectableCollection.defaultValues.mode,
	},
}

export default {
	name: 'BaseSelectableCollection',
	extends: BaseCollection,
	emits: emitsSelectableCollection,
	props: propsSelectableCollection,
}

/**
 * Синхронизация props и событий для SelectableCollection
 */
export function syncSelectableCollection(
	options: ISyncComponentModelOptions<ISelectableCollectionProps, ISelectableCollection>,
) {
	syncCollection(options)

	const { props, instance, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on(
		'change',
		(payload: { collection: ISelectableCollection; items: ISelectableCollectionItem[] }) => {
			emit?.('change', payload)
			emit?.('change:selected', instance.selected)
			emit?.('change:selectedCount', instance.selectedCount)
		},
	)

	watch<TSelectionMode | undefined>(
		() => props.mode,
		(value) => {
			if (value !== undefined && value !== instance.mode) {
				instance.mode = value
				emit?.('change:mode', value)
				emit?.('update:mode', value)
			}
		},
	)
}
