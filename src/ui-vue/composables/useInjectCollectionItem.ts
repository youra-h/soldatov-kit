import { inject, onBeforeUnmount, type UnwrapNestedRefs } from 'vue'
import { type ICollectionItem } from '@core'
import { COLLECTION_KEY } from './useProvideCollection'

export function useInjectCollectionItem<T extends ICollectionItem>(item: T | UnwrapNestedRefs<T>) {
	const collection = inject(COLLECTION_KEY, null)

	if (collection === null) return

	// Автоматическая регистрация в коллекции при монтировании (если декларативный режим)
	collection.insertAt(item)
	// Автоматическая де-регистрация при размонтировании
	onBeforeUnmount(() => collection.deleteItem(item))
}
