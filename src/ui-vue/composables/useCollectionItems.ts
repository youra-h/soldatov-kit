import { customRef, onUnmounted, type Ref } from 'vue'

interface ICollectionLike<TItem> {
	readonly items: TItem[]
	readonly events: {
		on(event: string, handler: (...args: any[]) => any): void
		off(event: string, handler: (...args: any[]) => any): void
	}
}

/**
 * Возвращает реактивный Ref со списком элементов коллекции.
 *
 * Проблема: мутации `_items.splice()` происходят на raw объекте внутри класса,
 * минуя Vue Proxy — Vue не знает об изменениях.
 *
 * Решение: customRef с ручным track/trigger через события коллекции.
 * При каждом изменении коллекции вызывается trigger() → Vue перечитывает items.
 * Сами данные не копируются — читается тот же collection.items.
 */
export function useCollectionItems<TItem>(collection: ICollectionLike<TItem>): Ref<TItem[]> {
	let _trigger: () => void

	const ref = customRef<TItem[]>((track, trigger) => {
		_trigger = trigger

		return {
			get() {
				track()
				return collection.items
			},
			set() {},
		}
	})

	collection.events.on('item:added', _trigger!)
	collection.events.on('item:deleted', _trigger!)
	collection.events.on('cleared', _trigger!)
	collection.events.on('item:moved', _trigger!)

	onUnmounted(() => {
		collection.events.off('item:added', _trigger!)
		collection.events.off('item:deleted', _trigger!)
		collection.events.off('cleared', _trigger!)
		collection.events.off('item:moved', _trigger!)
	})

	return ref
}
