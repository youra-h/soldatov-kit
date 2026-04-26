import { type Ref } from 'vue'
import { useEventRef } from './useEventRef'

interface ICollectionLike<TItem> {
	readonly items: TItem[]
	readonly events: {
		on(event: string, handler: (...args: any[]) => any): void
		off(event: string, handler: (...args: any[]) => any): void
	}
}

/**
 * Возвращает реактивный `Ref` со списком элементов коллекции.
 * Обновляется при добавлении, удалении, очистке и перемещении элементов.
 *
 * @param collection Коллекция с полями `items` и `events`.
 * @returns Реактивный `Ref<TItem[]>`.
 */
export function useCollectionItems<TItem>(collection: ICollectionLike<TItem>): Ref<TItem[]> {
	return useEventRef(
		collection.events,
		() => collection.items,
		['item:added', 'item:deleted', 'cleared', 'item:moved'],
	)
}
