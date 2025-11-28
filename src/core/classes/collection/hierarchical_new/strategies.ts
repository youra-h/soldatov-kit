import type { ICollection } from '../types'
import type { ICollectionItem } from '../item/types'
import { TSelectableCollection } from '../selectable/selectable-collection.class'
import { TActivatableCollection } from '../activable/activable-collection.class'
import type { IActivatableCollection } from '../activable/types'
import type { ISelectableCollection } from '../selectable/types'
import type { NodeRef, IActiveStrategy, ISelectionStrategy } from './types'

/** Один активный узел на всё дерево */
export class SingleActiveStrategy implements IActiveStrategy {
	private active?: NodeRef

	onAttach(_collection: ICollection): void {}
	onDetach(collection: ICollection): void {
		if (this.active?.collection === collection) this.active = undefined
	}
	reset(): void {
		this.active = undefined
	}

	handleActiveEvent(source: ICollection, _payload: any, nodeRef?: NodeRef): void {
		if (!nodeRef) return

		const prev = this.active
		if (prev && prev.node !== nodeRef.node) {
			// если предыдущая коллекция поддерживает clear(), вызываем
			const prevCollection = prev.collection as IActivatableCollection | null
			prevCollection?.clear?.()
		}

		this.active = nodeRef.node ? nodeRef : undefined
	}

	getActive(): ICollectionItem | undefined {
		return this.active?.node
	}

	getActivePath(): number[] | undefined {
		return this.active?.path
	}
}

/** Агрегирует множественный выбор из разных коллекций */
export class MultipleSelectionStrategy implements ISelectionStrategy {
	private selected = new Set<ICollectionItem>()

	onAttach(_collection: ICollection): void {}
	onDetach(collection: ICollection): void {
		for (const it of Array.from(this.selected)) {
			if (it.collection === collection) this.selected.delete(it)
		}
	}
	reset(): void {
		this.selected.clear()
	}

	handleSelectionEvent(source: ICollection, payload: { items?: ICollectionItem[] } | any): void {
		// payload.items — текущие выбранные элементы в source
		for (const it of Array.from(this.selected)) {
			if (it.collection === source) this.selected.delete(it)
		}
		const items = payload?.items ?? []
		for (const it of items) this.selected.add(it)
	}

	getSelected(): ICollectionItem[] {
		return Array.from(this.selected)
	}
}
