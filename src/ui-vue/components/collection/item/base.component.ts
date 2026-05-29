import { type ICollectionItem, type ICollectionItemProps } from '@core'
import { useInjectCollectionItem } from '../../../composables/useInjectCollectionItem'
import { useInjectCollectionItemPlugins } from '../../../composables/useInjectCollectionItemPlugins'
import type { TEmits, TProps, ISyncComponentModelOptions } from '../../../types'

export const emitsCollectionItem: TEmits = ['free', 'change:collection'] as const

export const propsCollectionItem: TProps = {}

export default {
	name: 'BaseCollectionItem',
	emits: emitsCollectionItem,
	props: propsCollectionItem,
}

export interface ICollectionItemState<T extends ICollectionItem = ICollectionItem> {}

/**
 * Синхронизация props и событий для CollectionItem
 */
export function syncCollectionItem(
	options: ISyncComponentModelOptions<ICollectionItemProps, ICollectionItem>,
): ICollectionItemState {
	const { instance, emit, plugins } = options

	// Использовать inject для получения коллекции родителя и автоматической регистрации в ней (если декларативный режим)
	useInjectCollectionItem(instance)
	useInjectCollectionItemPlugins(instance.uid, plugins)

	// Пробрасываем события core-инстанса наружу (Vue events)
	instance.events.on('free', (item: ICollectionItem) => {
		// Скрываем компонент через Vue proxy — иначе реактивность не сработает,
		// т.к. free() вызывается на raw-объекте, а не через proxy
		if ('rendered' in instance) {
			;(instance as ICollectionItem & { rendered: boolean }).rendered = false
		}
		emit?.('free', item)
	})

	return {}
}
