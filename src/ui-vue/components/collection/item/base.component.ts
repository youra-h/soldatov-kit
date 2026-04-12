import { type ICollectionItem, type ICollectionItemProps } from '@core'
import { useInjectCollectionItem } from '../../../composables/useInjectCollectionItem'
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

	// Использовать inject для получения коллекции родителя и автоматической регистрации в ней (если декларативный режим)
	useInjectCollectionItem(instance)

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on('free', (item: ICollectionItem) => {
		emit?.('free', item)
	})
}
