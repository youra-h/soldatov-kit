import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import {
	type ISelectableCollection,
	type ISelectableCollectionProps,
	type ISelectableCollectionItem,
	type TSelectionMode,
	TSelectableCollection,
} from '@core'
import {
	default as BaseCollection,
	emitsCollection,
	propsCollection,
	syncCollection,
	type ICollectionState,
} from '../base.component'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../../types'
import { useSyncProps } from '../../../composables/useSyncProps'

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

export interface ISelectableCollectionState extends ICollectionState {
	selected: Ref<ISelectableCollectionItem[]>
	selectedCount: Ref<number>
	mode: Ref<TSelectionMode>
}

/**
 * Синхронизация props и событий для SelectableCollection
 */
export function syncSelectableCollection(
	options: ISyncComponentModelOptions<ISelectableCollectionProps, ISelectableCollection>,
): ISelectableCollectionState {
	const base = syncCollection(options)

	const { props, instance, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on(
		'item:selected',
		(payload: { collection: ISelectableCollection; item: ISelectableCollectionItem }) => {
			emit?.('item:selected', payload)
		},
	)

	instance.events.on(
		'item:unselected',
		(payload: { collection: ISelectableCollection; item: ISelectableCollectionItem }) => {
			emit?.('item:unselected', payload)
		},
	)

	instance.events.on('selection:cleared', (payload: { collection: ISelectableCollection }) => {
		emit?.('selection:cleared', payload)
	})

	instance.events.on('change:selected' as any, (items: ISelectableCollectionItem[]) => {
		emit?.('change:selected', items)
	})

	instance.events.on('change:selectedCount' as any, (count: number) => {
		emit?.('change:selectedCount', count)
	})

	instance.events.on('change:mode' as any, (mode: TSelectionMode) => {
		emit?.('change:mode', mode)
		emit?.('update:mode', mode)
	})

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

	return {
		...base,
		...useSyncProps(instance.events, {
			selected: () => instance.selected,
			selectedCount: () => instance.selectedCount,
			mode: () => instance.mode,
		}),
	}
}
