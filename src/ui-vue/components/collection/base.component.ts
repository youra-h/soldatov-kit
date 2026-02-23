import { type ICollection, type ICollectionProps, type ICollectionItem } from '../../../core'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../types'

export const emitsCollection: TEmits = [
	'added',
	'beforeDelete',
	'afterDelete',
	'cleared',
	'beforeMove',
	'afterMove',
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
	instance.events.on('added', (payload: { collection: ICollection; item: ICollectionItem }) => {
		emit?.('added', payload)
	})

	instance.events.on(
		'beforeDelete',
		(payload: { collection: ICollection; index: number; item: ICollectionItem }) => {
			emit?.('beforeDelete', payload)
		},
	)

	instance.events.on(
		'afterDelete',
		(payload: { collection: ICollection; index: number; item: ICollectionItem }) => {
			emit?.('afterDelete', payload)
		},
	)

	instance.events.on('cleared', (payload: { collection: ICollection }) => {
		emit?.('cleared', payload)
	})

	instance.events.on(
		'beforeMove',
		(payload: { collection: ICollection; oldIndex: number; newIndex: number }) => {
			emit?.('beforeMove', payload)
		},
	)

	instance.events.on(
		'afterMove',
		(payload: {
			collection: ICollection
			item: ICollectionItem
			oldIndex: number
			newIndex: number
		}) => {
			emit?.('afterMove', payload)
		},
	)

	instance.events.on(
		'changed',
		(payload: { collection: ICollection; item?: ICollectionItem }) => {
			emit?.('changed', payload)
		},
	)
}
