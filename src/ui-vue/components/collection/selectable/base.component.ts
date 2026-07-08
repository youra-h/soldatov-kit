import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import {
	type ICollectionSource,
	type ISelectableCollection,
	type ISelectableCollectionProps,
	type ISelectableCollectionItem,
	type TSelectionMode,
	type TSelectableCollectionEvents,
	TSelectableCollection,
} from '@core'
import {
	default as BaseCollection,
	emitsCollection,
	propsCollection,
	syncCollection,
	type ICollectionState,
} from '../base.component'
import type { TEmits, TProps, ISyncComponentOptions } from '../../../types'
import { useSyncProps } from '../../../composables/useSyncProps'

export const emitsSelectableCollection: TEmits = [
	...emitsCollection,
	'item:selected',
	'item:unselected',
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

export interface ISelectableCollectionState<TItem = ISelectableCollectionItem>
	extends ICollectionState<TItem> {
	selected: Ref<TItem[]>
	selectedCount: Ref<number>
	mode: Ref<TSelectionMode>
}

/**
 * Синхронизация props и событий для SelectableCollection
 */
export function syncSelectableCollection<
	TItem extends ISelectableCollectionItem = ISelectableCollectionItem,
>(
	options: ISyncComponentOptions<
		ISelectableCollectionProps<TItem> & ICollectionSource<TItem>,
		ISelectableCollection<ISelectableCollectionProps, TSelectableCollectionEvents, TItem>
	>,
): ISelectableCollectionState<TItem> {
	const syncProps = syncCollection(options)

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
			}
		},
	)

	return {
		...syncProps,
		...useSyncProps(instance.events, {
			selected: () => instance.selected,
			selectedCount: () => instance.selectedCount,
			mode: () => instance.mode,
		}),
	}
}
