import { inject, onMounted, onBeforeUnmount } from 'vue'
import { COLLECTION_KEY } from './useProvideCollection'

// Минимальный интерфейс — только то, что нужно от item.
// Reactive proxy совместим с этим типом.
export interface ICollectionMember {
	collection: any
}

export function useInjectCollectionItem(item: ICollectionMember) {
	const collection = inject(COLLECTION_KEY, null)

	onMounted(() => collection!.insertAt(item))
	onBeforeUnmount(() => collection!.deleteItem(item))
}
