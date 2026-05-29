import type { Ref } from 'vue'
import {
	type IActivatableCollection,
	type IActivatableCollectionProps,
	type IActivatableCollectionItem,
	type TActivatableCollectionEvents,
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

export const emitsActivatableCollection: TEmits = [
	...emitsCollection,
	'item:activated',
	'item:deactivated',
	'change:activeItem',
] as const

export const propsActivatableCollection: TProps = {
	...propsCollection,
}

export default {
	name: 'BaseActivatableCollection',
	extends: BaseCollection,
	emits: emitsActivatableCollection,
	props: propsActivatableCollection,
}

export interface IActivatableCollectionState<TItem = any> extends ICollectionState {
	activeItem: Ref<TItem | undefined>
}

/**
 * Синхронизация props и событий для ActivatableCollection
 */
export function syncActivatableCollection<
	TItem extends IActivatableCollectionItem = IActivatableCollectionItem,
>(
	options: ISyncComponentModelOptions<
		IActivatableCollectionProps,
		IActivatableCollection<IActivatableCollectionProps, TActivatableCollectionEvents, TItem>
	>,
): IActivatableCollectionState<TItem> {
	const syncProps = syncCollection(options)

	const { instance, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on(
		'item:activated',
		(payload: { collection: IActivatableCollection; item: IActivatableCollectionItem }) => {
			emit?.('item:activated', payload)
		},
	)

	instance.events.on('item:deactivated', (payload: { collection: IActivatableCollection }) => {
		emit?.('item:deactivated', payload)
	})

	return {
		...syncProps,
		...useSyncProps(instance.events, {
			activeItem: {
				value: () => instance.activeItem,
				events: ['item:activated', 'item:deactivated'],
			},
		}),
	}
}
