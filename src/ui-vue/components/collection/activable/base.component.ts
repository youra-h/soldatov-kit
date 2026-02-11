import type { PropType } from 'vue'
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
	'change',
	'change:activeItem',
	'update:activeItem',
] as const

export const propsActivatableCollection: TProps = {
	...propsCollection,
	activeItem: {
		type: Object as PropType<IActivatableCollectionItem | undefined>,
		default: undefined,
	},
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
		'change',
		(payload: { collection: IActivatableCollection; item?: IActivatableCollectionItem }) => {
			emit?.('change', payload)
			emit?.('change:activeItem', instance.activeItem)
			emit?.('update:activeItem', instance.activeItem)
		},
	)
}
