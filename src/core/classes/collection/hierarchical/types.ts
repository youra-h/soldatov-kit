import type { ICollectionItem } from '../item/types'
import { TSelectableCollection } from '../selectable/selectable-collection.class'
import { TActivatableCollection } from '../activable/activable-collection.class'

/**
 * Общий интерфейс стратегии для дерева.
 */
export interface ITreeStrategy {
	handleChange(collection: any, payload: any): void
	getSelectedItems(): ICollectionItem[]
	getActiveItem(): ICollectionItem | undefined
}
