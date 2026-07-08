import { TSelectableCollectionItem } from './selectable-collection-item.class'
import type { TCollection } from '../collection.class'
import { TEvented } from '../../../../common'
import type { TClasses } from '../../../../common'
import type { TConstructor } from '../../../../common'
import type { ISelectableComponentItem } from './types'

/** * Миксин для компонентов-элементов выбираемой коллекции (TCollapseItem, TListItem, etc.).
 * Инкапсулирует композицию с TSelectableCollectionItem и проксирование свойств/событий.
 *
 * Использование:
 * ```ts
 * class TListItem
 *   extends SelectableComponentMixin(TListItemCustom<IListItemProps, TListItemEvents>)
 *   implements IListItem
 * {
 *   constructor(options) {
 *     const { collection, ...rest } = options
 *     super(rest)
 *     this._initSelectableComposition(collection)
 *   }
 * }
 * ```
 */
export function SelectableComponentMixin<
	TBase extends TConstructor<{
		events: TEvented<any>
		disabled: boolean
		rendered: boolean
		classes: TClasses
	}>,
>(Base: TBase) {
	class SelectableComponent extends Base implements ISelectableComponentItem {
		protected _collectionItem!: TSelectableCollectionItem

		protected _initSelectableComposition(collection: TCollection | null | undefined): void {
			this._collectionItem = new TSelectableCollectionItem({
				collection: collection ?? undefined,
			})

			this._collectionItem.events.on('change:selection', (item) => {
				this.classes.toggle('--selected', !!item.selected)
				;(this.events as TEvented<any>).emit('change:selection', this)
			})

			this._collectionItem.events.on('change:order', (value: number) => {
				;(this.events as TEvented<any>).emit('change:order', value)
			})

			this._collectionItem.events.on('free', () => {
				;(this.events as TEvented<any>).emit('free', this)
			})
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

		toggleSelected(): void {
			this._collectionItem.toggleSelected()
		}

		select(): void {
			this.selected = true
		}

		deselect(): void {
			this.selected = false
		}

		free(): void {
			this.rendered = false
			this._collectionItem.free()
		}
	}

	return SelectableComponent
}
