import { type ICollection, type ICollectionProps, type ICollectionItem } from '../../../core'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'

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

export const propsCollection: TProps = {}

export default {
	name: 'BaseCollection',
	emits: emitsCollection,
	props: propsCollection,
}

/**
 * Синхронизация props и событий для Collection
 */
export function syncCollection(options: ISyncComponentModelOptions<ICollectionProps, ICollection>) {
	const { instance, emit } = options

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
}
