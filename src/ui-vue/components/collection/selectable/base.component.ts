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
	'item:selected',
	'item:unselected',
	'selection:cleared',
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
		'item:selected',
		(payload: { collection: ISelectableCollection; item: ISelectableCollectionItem }) => {
			emit?.('item:selected', payload)
			emit?.('change:selected', instance.selected)
			emit?.('change:selectedCount', instance.selectedCount)
		},
	)

	instance.events.on(
		'item:unselected',
		(payload: { collection: ISelectableCollection; item: ISelectableCollectionItem }) => {
			emit?.('item:unselected', payload)
			emit?.('change:selected', instance.selected)
			emit?.('change:selectedCount', instance.selectedCount)
		},
	)

	instance.events.on(
		'selection:cleared',
		(payload: { collection: ISelectableCollection }) => {
			emit?.('selection:cleared', payload)
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
