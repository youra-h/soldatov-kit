import { TBasePlugin } from '../../base/plugin'
import { TElementPlugin } from '../element'
import { TInstancePlugin } from '../instance'
import { TCollectionItemPlugins } from './item-plugins.plugin'
import type { IPluginBundle } from '../../base/types'
import type { TCollectionElementsPluginEvents } from './types'

/**
 * Тонкая прослойка над TCollectionItemPlugins — кеширует элементы.
 *
 * Слушает item:registered / item:unregistered, дёргает TElementPlugin
 * из бандла и ретранслирует element:added / element:removed.
 * reorder по-прежнему здесь, т.к. нужен доступ к коллекции.
 */
export class TCollectionElementsPlugin extends TBasePlugin<TCollectionElementsPluginEvents> {
	static readonly key = 'collection-elements'

	private readonly _elements = new Map<string | number, HTMLElement>()
	private readonly _present = new Map<string | number, boolean>()
	private _collection: any = null

	get elements(): ReadonlyMap<string | number, HTMLElement> {
		return this._elements
	}

	override install(bundle: IPluginBundle): void {
		const instancePlugin = bundle.get(TInstancePlugin)

		instancePlugin?.events.on('ready', ({ instance }: { instance: any }) => {
			this._collection = instance.collection ?? instance
			this._collection.events.on('item:moved', () => this._reorder())
		})

		const itemPlugins = bundle.get(TCollectionItemPlugins)

		itemPlugins?.events.on('item:registered', ({ uid, bundle: itemBundle }) => {
			const elementPlugin = itemBundle.get(TElementPlugin)

			if (!elementPlugin) return

			const add = (el: HTMLElement) => {
				this._elements.set(uid, el)
				this.events.emit('element:added', { uid, element: el })
			}

			if (elementPlugin.element) add(elementPlugin.element)

			elementPlugin.events.on('ready', ({ element }) => add(element))

			elementPlugin.events.on('removed', () => {
				this._elements.delete(uid)
				this._present.delete(uid)
				this.events.emit('element:removed', { uid })
			})

			// present
			const instancePlugin = itemBundle.get(TInstancePlugin)

			if (instancePlugin) {
				instancePlugin.ready().then((instance) => {
					this._present.set(uid, instance.present)
					instance.events.on('change:present', (value: boolean) => {
						this._present.set(uid, value)
						this.events.emit('element:present', { uid, present: value })
					})
				})
			}
		})

		itemPlugins?.events.on('item:unregistered', ({ uid }) => {
			this._elements.delete(uid)
			this._present.delete(uid)
		})
	}

	private _reorder(): void {
		if (!this._collection) return

		const old = new Map(this._elements)

		this._elements.clear()

		for (const item of this._collection.items) {
			const uid = (item as any).uid
			if (old.has(uid)) this._elements.set(uid, old.get(uid)!)
		}
	}

	getByUid(uid: string | number): HTMLElement | null {
		return this._elements.get(uid) ?? null
	}

	getByIndex(index: number): HTMLElement | null {
		return Array.from(this._elements.values())[index] ?? null
	}

	getUidByElement(el: HTMLElement): string | number | null {
		for (const [uid, element] of this._elements) {
			if (element === el) return uid
		}
		return null
	}

	getAll(): HTMLElement[] {
		return Array.from(this._elements.values())
	}

	getVisible(): HTMLElement[] {
		const result: HTMLElement[] = []
		for (const [uid, el] of this._elements) {
			if (this._present.get(uid) === true) result.push(el)
		}
		return result
	}
}
