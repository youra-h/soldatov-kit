import { TSelectableCollectionItem } from '../../../base/collection'
import TListItemCustom from './list-item-custom.class'
import type {
	IListItem,
	IListItemOptions,
	IListItemProps,
	TListItemEvents,
} from './types'
import type { TCollection } from '../../../base/collection'
import { TEvented } from '../../../common/evented'

export default class TListItem
	extends TListItemCustom<IListItemProps, TListItemEvents>
	implements IListItem
{
	protected _collectionItem: TSelectableCollectionItem

	constructor(options: IListItemOptions | Partial<IListItemProps> = {}) {
		const { collection, ...componentOptions } = options as IListItemOptions
		super(componentOptions)

		this._collectionItem = new TSelectableCollectionItem({ collection })

		this._collectionItem.events.on('change:selection', () => {
			this._classes.toggle('--selected', this._collectionItem.selected)
			;(this.events as TEvented<TListItemEvents>).emit('change:selection', this)
		})

		this._collectionItem.events.on('change:order', (value: number) => {
			;(this.events as TEvented<TListItemEvents>).emit('change:order', value)
		})

		this._collectionItem.events.on('free', () => {
			;(this.events as TEvented<TListItemEvents>).emit('free', this)
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

	/**
	 * Выбирает элемент, устанавливая его в состояние selected = true.
	 */
	select(): void {
		this.selected = true
	}

	/**
	 * Снимает выбор с элемента, устанавливая его в состояние selected = false.
	 */
	deselect(): void {
		this.selected = false
	}

	/**
	 * Переключает состояние элемента между выбранным (selected = true) и невыбранным (selected = false).
	 */
	toggleSelected(): void {
		this._collectionItem.toggleSelected()
	}

	override getProps(): IListItemProps {
		return {
			...super.getProps(),
			selected: this.selected,
			order: this.order,
			wordWrap: this.wordWrap,
		}
	}

	override assign(source: Partial<IListItem>): void {
		super.assign(source)

		if (source.selected !== undefined) this.selected = source.selected
	}

	free(): void {
		this._collectionItem.free()
	}
}
