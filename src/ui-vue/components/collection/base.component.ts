import type { PropType, Ref } from 'vue'
import { watch } from 'vue'
import { type ICollection, type ICollectionProps, type ICollectionItem } from '@core'
import { TCollectionElementsPlugin } from '@plugins'
import { useProvideCollection } from '../../composables/useProvideCollection'
import { useProvideCollectionPlugins } from '../../composables/useProvideCollectionPlugins'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'
import { useSyncProps } from '../../composables/useSyncProps'

export const emitsCollection: TEmits = [
	'item:added',
	'item:beforeDelete',
	'item:deleted',
	'item:afterDelete',
	'cleared',
	'item:beforeMove',
	'item:moved',
	'item:afterMove',
	'changed',
] as const

export const propsCollection: TProps = {
	items: {
		type: Array as PropType<Partial<ICollectionItem>[]>,
		default: undefined,
	},
}

export default {
	name: 'BaseCollection',
	emits: emitsCollection,
	props: propsCollection,
}

export interface ICollectionState<TItem = any> {
	items: Ref<TItem[]>
	count: Ref<number>
}

/**
 * Синхронизация props и событий для Collection
 */
export function syncCollection(
	options: ISyncComponentModelOptions<ICollectionProps, ICollection>,
): ICollectionState {
	const { instance, emit, props, plugins } = options

	useProvideCollection(instance)

	const collectionPlugin = plugins.get(TCollectionElementsPlugin)

	if (collectionPlugin) {
		useProvideCollectionPlugins((uid, bundle) => collectionPlugin.register(uid, bundle))
	}

	// Наполняем коллекцию из prop items через сеттер instance.items
	watch(
		() => props.items,
		(items) => {
			if (items !== undefined) {
				instance.items = items
			}
		},
		{ immediate: true },
	)

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on(
		'item:added',
		(payload: { collection: ICollection; item: ICollectionItem }) => {
			emit?.('item:added', payload)
		},
	)

	instance.events.on(
		'item:deleted',
		(payload: { collection: ICollection; item: ICollectionItem }) => {
			emit?.('item:deleted', payload)
		},
	)

	instance.events.on(
		'item:beforeDelete',
		(payload: { collection: ICollection; index: number; item: ICollectionItem }) => {
			emit?.('item:beforeDelete', payload)
		},
	)

	instance.events.on(
		'item:afterDelete',
		(payload: { collection: ICollection; index: number; item: ICollectionItem }) => {
			emit?.('item:afterDelete', payload)
		},
	)

	instance.events.on('cleared', (payload: { collection: ICollection }) => {
		emit?.('cleared', payload)
	})

	instance.events.on(
		'item:beforeMove',
		(payload: { collection: ICollection; oldIndex: number; newIndex: number }) => {
			emit?.('item:beforeMove', payload)
		},
	)

	instance.events.on(
		'item:moved',
		(payload: {
			collection: ICollection
			item: ICollectionItem
			oldIndex: number
			newIndex: number
		}) => {
			emit?.('item:moved', payload)
		},
	)

	instance.events.on(
		'item:afterMove',
		(payload: {
			collection: ICollection
			item: ICollectionItem
			oldIndex: number
			newIndex: number
		}) => {
			emit?.('item:afterMove', payload)
		},
	)

	instance.events.on(
		'changed',
		(payload: { collection: ICollection; item?: ICollectionItem }) => {
			emit?.('changed', payload)
		},
	)

	// Возвращаем реактивные Ref-ы для items и count
	return useSyncProps(instance.events as any, {
		items: () => instance.items,
		count: () => instance.count,
	})
}
