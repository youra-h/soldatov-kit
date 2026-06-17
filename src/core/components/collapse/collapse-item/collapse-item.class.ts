import { TSelectableCollectionItem } from '../../../base/collection'
import TCollapseItemCustom from './collapse-item-custom.class'
import type {
	ICollapseItem,
	TCollapseItemOptions,
	ICollapseItemProps,
	TCollapseItemEvents,
} from './types'
import type { TCollection } from '../../../base/collection'
import { TEvented } from '../../../common/evented'

export default class TCollapseItem
	extends TCollapseItemCustom<ICollapseItemProps, TCollapseItemEvents>
	implements ICollapseItem
{
	protected _collectionItem: TSelectableCollectionItem

	constructor(options: TCollapseItemOptions | Partial<ICollapseItemProps> = {}) {
		const { collection, ...componentOptions } = options as TCollapseItemOptions
		super(componentOptions)

		this._collectionItem = new TSelectableCollectionItem({ collection })

		this._collectionItem.events.on('change:selection', () => {
			this._classes.toggle('--open', this._collectionItem.selected)
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
	}

	get order(): number {
		return this._collectionItem.order
	}

	set order(value: number) {
		this._collectionItem.order = value
	}

	/**
	 * Открывает элемент, устанавливая его в состояние selected = true. Если элемент уже открыт (selected = true), метод не выполняет никаких действий.
	 */
	open(): void {
		this.selected = true
	}

	/**
	 * Закрывает элемент, устанавливая его в состояние selected = false. Если элемент уже закрыт (selected = false), метод не выполняет никаких действий.
	 */
	close(): void {
		this.selected = false
	}

	/**
	 * Переключает состояние элемента между открытым (selected = true) и закрытым (selected = false). Если элемент открыт, он будет закрыт, и наоборот. Этот метод обеспечивает удобный способ изменения состояния элемента без необходимости явно проверять его текущее состояние.
	 */
	toggleSelected(): void {
		this._collectionItem.toggleSelected()
	}

	override getProps(): ICollapseItemProps {
		return {
			...super.getProps(),
			selected: this.selected,
			order: this.order,
		}
	}

	override assign(source: Partial<ICollapseItem>): void {
		super.assign(source)

		if (source.selected !== undefined) this.selected = source.selected
	}

	free(): void {
		this._collectionItem.free()
	}
}
