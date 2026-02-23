import { type ICollectionItem, type ICollectionItemProps } from '../../../../core'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../../types'

export const emitsCollectionItem: TEmits = ['free', 'change:collection'] as const

export const propsCollectionItem: TProps = {}

export default {
	name: 'BaseCollectionItem',
	emits: emitsCollectionItem,
	props: propsCollectionItem,
}

/**
 * Синхронизация props и событий для CollectionItem
 */
export function syncCollectionItem(
	options: ISyncComponentModelOptions<ICollectionItemProps, ICollectionItem>,
) {
	const { instance, emit } = options

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on('free', (item: ICollectionItem) => {
		emit?.('free', item)
	})
}
