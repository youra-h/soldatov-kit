import type { IComponentView } from '../../../core'
import { TBasePlugin } from '../../base/plugin'
import { TInstancePlugin } from '../instance'
import { TCollectionItemPlugins } from './item-plugins.plugin'
import type { IPluginBundle } from '../../base/types'
import type { TCollectionInstancesPluginEvents } from './types'

/**
 * Тонкая прослойка над TCollectionItemPlugins — кеширует instance.
 *
 * Слушает item:registered / item:unregistered, дёргает TInstancePlugin
 * из бандла и ретранслирует instance:added / instance:removed.
 * reorder по-прежнему здесь, т.к. нужен доступ к коллекции.
 */
export class TCollectionInstancesPlugin extends TBasePlugin<TCollectionInstancesPluginEvents> {
	static readonly key = 'collection-instances'

	private readonly _instances = new Map<string | number, IComponentView>()
	private _collection: any = null

	get instances(): ReadonlyMap<string | number, IComponentView> {
		return this._instances
	}

	override install(bundle: IPluginBundle): void {
		const instancePlugin = bundle.get(TInstancePlugin)

		instancePlugin?.events.on('ready', ({ instance }: { instance: any }) => {
			this._collection = instance.collection ?? instance
			this._collection.events.on('item:moved', () => this._reorder())
		})

		const itemPlugins = bundle.get(TCollectionItemPlugins)

		itemPlugins?.events.on('item:registered', ({ uid, bundle: itemBundle }) => {
			const instanceP = itemBundle.get(TInstancePlugin)
			if (!instanceP) return

			if (instanceP.instance) {
				this._instances.set(uid, instanceP.instance)
				this.events.emit('instance:added', { uid, instance: instanceP.instance })
			}

			instanceP.events.on('ready', ({ instance }) => {
				this._instances.set(uid, instance)
				this.events.emit('instance:added', { uid, instance })
			})

			instanceP.events.on('removed', () => {
				this._instances.delete(uid)
				this.events.emit('instance:removed', { uid })
			})
		})

		itemPlugins?.events.on('item:unregistered', ({ uid }) => {
			this._instances.delete(uid)
		})
	}

	private _reorder(): void {
		if (!this._collection) return

		const old = new Map(this._instances)

		this._instances.clear()

		for (const item of this._collection.items) {
			const uid = (item as any).uid
			if (old.has(uid)) this._instances.set(uid, old.get(uid)!)
		}
	}

	getByUid(uid: string | number): IComponentView | null {
		return this._instances.get(uid) ?? null
	}

	getByIndex(index: number): IComponentView | null {
		return Array.from(this._instances.values())[index] ?? null
	}

	getUidByInstance(instance: IComponentView): string | number | null {
		for (const [uid, current] of this._instances) {
			if (current === instance) return uid
		}
		return null
	}

	getAll(): IComponentView[] {
		return Array.from(this._instances.values())
	}

	getVisible(): IComponentView[] {
		const result: IComponentView[] = []
		for (const instance of this._instances.values()) {
			if (instance.present) result.push(instance)
		}
		return result
	}
}
