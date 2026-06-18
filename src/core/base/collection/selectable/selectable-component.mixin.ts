import { TSelectableCollectionItem } from './selectable-collection-item.class'
import type { TCollection } from '../collection.class'
import { TEvented } from '../../../common/evented'
import type { TClasses } from '../../../common/classes'

type Constructor<T = {}> = abstract new (...args: any[]) => T

export interface ISelectableComponentMixinOptions {
	collection?: TCollection | null
	selectedClass: string
}

/**
 * Миксин для компонентов-элементов выбираемой коллекции (TCollapseItem, etc.).
 * Инкапсулирует композицию с TSelectableCollectionItem и проксирование свойств/событий.
 *
 * Использование:
 * ```ts
 * class TCollapseItem
 *   extends SelectableComponentMixin(TCollapseItemCustom<ICollapseItemProps, TCollapseItemEvents>)
 *   implements ICollapseItem
 * {
 *   constructor(options) {
 *     const { collection, ...rest } = options
 *     super(rest)
 *     this._initSelectableComposition({ collection, selectedClass: '--open' })
 *   }
 * }
 * ```
 */
export function SelectableComponentMixin<
	TBase extends Constructor<{
		events: TEvented<any>
		disabled: boolean
		rendered: boolean
		_classes: TClasses
	}>,
>(Base: TBase) {
	abstract class SelectableComponent extends Base {
		protected _collectionItem!: TSelectableCollectionItem

		protected _initSelectableComposition(options: ISelectableComponentMixinOptions): void {
			this._collectionItem = new TSelectableCollectionItem({
				collection: options.collection ?? undefined,
			})

			this._collectionItem.events.on('change:selection', () => {
				this._classes.toggle(options.selectedClass, this._collectionItem.selected)
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

		open(): void {
			this.selected = true
		}

		close(): void {
			this.selected = false
		}

		free(): void {
			this.rendered = false
			this._collectionItem.free()
		}
	}

	return SelectableComponent
}
