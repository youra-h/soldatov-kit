import {
	type IActivatableCollection,
	type IActivatableCollectionProps,
	type IActivatableCollectionItem,
} from '../../../../core'
import {
	default as BaseCollection,
	emitsCollection,
	propsCollection,
	syncCollection,
} from '../base.component'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../../types'

export const emitsActivatableCollection: TEmits = [
	...emitsCollection,
	'item:activated',
	'item:deactivated',
	'change:activeItem',
] as const

export const propsActivatableCollection: TProps = {
	...propsCollection
}

export default {
	name: 'BaseActivatableCollection',
	extends: BaseCollection,
	emits: emitsActivatableCollection,
	props: propsActivatableCollection,
}

/**
 * Синхронизация props и событий для ActivatableCollection
 */
export function syncActivatableCollection(
	options: ISyncComponentModelOptions<IActivatableCollectionProps, IActivatableCollection>,
) {
	syncCollection(options)

	const { instance, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on(
		'item:activated',
		(payload: { collection: IActivatableCollection; item: IActivatableCollectionItem }) => {
			emit?.('item:activated', payload)
			emit?.('change:activeItem', instance.activeItem)
		},
	)

	instance.events.on(
		'item:deactivated',
		(payload: { collection: IActivatableCollection }) => {
			emit?.('item:deactivated', payload)
			emit?.('change:activeItem', instance.activeItem)
		},
	)
}
