import { TCollection } from './collections.class'

export class TCollectionItem {
	collection: TCollection | null = null
	id: number = 0

	private _index: number = -1

	constructor(collection?: TCollection) {
		if (collection) {
			this.collection = collection
		}
	}

	get index(): number {
		return this._index
	}

	set index(value: number) {
		if (this.collection) {
			this.collection.setItemIndex(this, value)
		} else {
			this._index = value
		}
	}

	/** @internal Только для коллекции. Прямая установка индекса без перемещения. */
	_updateIndex(value: number): void {
		this._index = value
	}

	assign(source: TCollectionItem): void {
		if (!source) return

		this.id = source.id
	}

	changed(): void {
		if (this.collection) {
			this.collection.itemChanged(this)
		}
	}
}
