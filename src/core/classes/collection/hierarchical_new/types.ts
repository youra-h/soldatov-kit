import type { ICollection } from './../types'
import type { ICollectionItem } from '../item/types'

export type NodeRef = {
	node: ICollectionItem
	collection: ICollection | null
	path: number[]
}

/** Общие хуки для стратегий */
export interface IBaseStrategy {
	onAttach(collection: ICollection): void
	onDetach(collection: ICollection): void
	reset?(): void
}

/** Стратегия для глобальной активации одного узла */
export interface IActiveStrategy extends IBaseStrategy {
	handleActiveEvent(source: ICollection, payload: any, nodeRef?: NodeRef): void
	getActive?(): ICollectionItem | undefined
	getActivePath?(): number[] | undefined
}

/** Стратегия для агрегирования множественного выбора */
export interface ISelectionStrategy extends IBaseStrategy {
	handleSelectionEvent(source: ICollection, payload: any, nodeRef?: NodeRef): void
	getSelected?(): ICollectionItem[]
}
