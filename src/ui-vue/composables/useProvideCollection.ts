import { provide, type InjectionKey } from 'vue'

// Минимальный интерфейс — только то, что нужно для регистрации items.
// Reactive proxy совместим с этим типом, в отличие от полного ICollection.
export interface ICollectionHost {
	insertAt(item: any, index?: number): boolean
	deleteItem(item: any): boolean
}

export const COLLECTION_KEY: InjectionKey<ICollectionHost> = Symbol('collection')

export function useProvideCollection(collection: ICollectionHost): void {
	provide(COLLECTION_KEY, collection)
}
