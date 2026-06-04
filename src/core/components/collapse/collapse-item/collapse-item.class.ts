import TValueControl from '../../../base/value-control/value-control.class'
import type { IComponentViewOptions } from '../../../base/component-view'
import { TSelectableCollectionItem } from '../../../base/collection'
import type { TCollection } from '../../../base/collection'
import type { ICollapseItem, ICollapseItemOptions, ICollapseItemProps, TCollapseItemEvents } from './types'
import { TEvented } from '../../../common/evented'

export default class TCollapseItem
	extends TValueControl<string | number, ICollapseItemProps, TCollapseItemEvents>
	implements ICollapseItem
{
	static override baseClass = 's-collapse-item'

	static defaultValues: Partial<ICollapseItemProps> = {
		...TValueControl.defaultValues,
		value: '',
		tag: 'div',
	}

	protected _collectionItem: TSelectableCollectionItem

	constructor(options: ICollapseItemOptions | Partial<ICollapseItemProps> = {}) {
		const { collection, ...componentOptions } = options as ICollapseItemOptions
		super(componentOptions)

		this._collectionItem = new TSelectableCollectionItem({ collection })

		this._collectionItem.events.on('change:selection', () => {
			;(this.events as TEvented<TCollapseItemEvents>).emit('change:selection', this)
		})

		this._collectionItem.events.on('change:order', (value: number) => {
			;(this.events as TEvented<TCollapseItemEvents>).emit('change:order', value)
		})

		this._collectionItem.events.on('free', () => {
			;(this.events as TEvented<TCollapseItemEvents>).emit('free', this)
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
		this._classes.toggle('--open', value)
	}

	get order(): number {
		return this._collectionItem.order
	}

	set order(value: number) {
		this._collectionItem.order = value
	}

	open(): void {
		this.selected = true
	}

	close(): void {
		this.selected = false
	}

	toggleSelected(): void {
		this._collectionItem.toggleSelected()
	}

	free(): void {
		this._collectionItem.free()
	}
}
