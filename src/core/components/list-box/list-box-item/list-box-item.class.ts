import { TSelectableCollectionItem } from '../../../base/collection'
import TListBoxItemCustom from './list-box-item-custom.class'
import type {
	IListBoxItem,
	IListBoxItemOptions,
	IListBoxItemProps,
	TListBoxItemEvents,
} from './types'
import type { TCollection } from '../../../base/collection'
import { TEvented } from '../../../common/evented'

export default class TListBoxItem
	extends TListBoxItemCustom<IListBoxItemProps, TListBoxItemEvents>
	implements IListBoxItem
{
	protected _collectionItem: TSelectableCollectionItem

	constructor(options: IListBoxItemOptions | Partial<IListBoxItemProps> = {}) {
		const { collection, ...componentOptions } = options as IListBoxItemOptions
		super(componentOptions)

		this._collectionItem = new TSelectableCollectionItem({ collection })

		this._collectionItem.events.on('change:selection', () => {
			this._classes.toggle('--selected', this._collectionItem.selected)
			;(this.events as TEvented<TListBoxItemEvents>).emit('change:selection', this)
		})

		this._collectionItem.events.on('change:order', (value: number) => {
			;(this.events as TEvented<TListBoxItemEvents>).emit('change:order', value)
		})

		this._collectionItem.events.on('free', () => {
			;(this.events as TEvented<TListBoxItemEvents>).emit('free', this)
		})
	}

	override click(event?: Event): void {
		if (!this.disabled) {
			this.toggleSelected()
		}
		super.click(event)
	}

	get collection(): TCollection | null {
		return this._collectionItem.collection
	}

	set collection(value: TCollection | null) {
		this._collectionItem.collection = value
	}

	get selected(): boolean {
		return this._collectionItem.selected
	}

	set selected(value: boolean) {
		if (value && this.disabled) return

		this._collectionItem.selected = value
	}

	get order(): number {
		return this._collectionItem.order
	}

	set order(value: number) {
		this._collectionItem.order = value
	}

	select(): void {
		this.selected = true
	}

	deselect(): void {
		this.selected = false
	}

	toggleSelected(): void {
		this._collectionItem.toggleSelected()
	}

	override getProps(): IListBoxItemProps {
		return {
			...super.getProps(),
			selected: this.selected,
			order: this.order,
		}
	}

	override assign(source: Partial<IListBoxItem>): void {
		super.assign(source)

		if (source.selected !== undefined) this.selected = source.selected
	}

	free(): void {
		this._collectionItem.free()
	}
}
