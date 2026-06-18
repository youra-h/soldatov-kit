import { TActivatableCollectionItem } from './activable-collection-item.class'
import type { TCollection } from '../collection.class'
import { TEvented } from '../../../common/evented'
import type { TClasses } from '../../../common/classes'

type Constructor<T = {}> = abstract new (...args: any[]) => T

export interface IActivatableComponentMixinOptions {
	collection?: TCollection | null
	activeClass: string
}

/**
 * Миксин для компонентов-элементов активируемой коллекции (TTabItem, etc.).
 * Инкапсулирует композицию с TActivatableCollectionItem и проксирование свойств/событий.
 *
 * Использование:
 * ```ts
 * class TTabItem
 *   extends ActivatableComponentMixin(TTabItemCustom<ITabItemProps, TTabItemEvents>)
 *   implements ITabItem
 * {
 *   constructor(options) {
 *     const { collection, ...rest } = options
 *     super(rest)
 *     this._initActivatableComposition({ collection, activeClass: '--active' })
 *   }
 * }
 * ```
 */
export function ActivatableComponentMixin<
	TBase extends Constructor<{
		events: TEvented<any>
		disabled: boolean
		rendered: boolean
		_classes: TClasses
	}>,
>(Base: TBase) {
	abstract class ActivatableComponent extends Base {
		protected _collectionItem!: TActivatableCollectionItem

		protected _initActivatableComposition(options: IActivatableComponentMixinOptions): void {
			this._collectionItem = new TActivatableCollectionItem({
				collection: options.collection ?? undefined,
			})

			this._collectionItem.events.on('change:activation', () => {
				this._classes.toggle(options.activeClass, this._collectionItem.active)
				;(this.events as TEvented<any>).emit('change:activation', this)
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

		get active(): boolean {
			return this._collectionItem.active
		}

		set active(value: boolean) {
			if (value && this.disabled) return
			this._collectionItem.active = value
		}

		get order(): number {
			return this._collectionItem.order
		}

		set order(value: number) {
			this._collectionItem.order = value
		}

		toggleActive(): void {
			this._collectionItem.toggleActive()
		}

		free(): void {
			this.rendered = false
			this._collectionItem.free()
		}
	}

	return ActivatableComponent
}
