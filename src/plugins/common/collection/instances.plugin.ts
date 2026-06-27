import type { IComponentView } from '../../../core'
import { TBasePlugin } from '../../base/plugin'
import { TInstancePlugin } from '../instance'
import type { IPluginBundle } from '../../base/types'
import type { TCollectionInstancesPluginEvents } from './types'

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
	}

	private _reorder(): void {
		if (!this._collection) return

		const oldInstances = new Map(this._instances)

		this._instances.clear()

		for (const item of this._collection.items) {
			const uid = (item as any).uid
			if (oldInstances.has(uid)) {
				this._instances.set(uid, oldInstances.get(uid)!)
			}
		}
	}

	/**
	 * Регистрирует дочерний bundle: подписывается на TInstancePlugin этого bundle
	 * и отслеживает появление/исчезновение instance.
	 */
	register(uid: string | number, bundle: IPluginBundle): void {
		const instancePlugin = bundle.get(TInstancePlugin)

		if (!instancePlugin) return

		if (instancePlugin.instance) {
			this._instances.set(uid, instancePlugin.instance)
			this.events.emit('instance:added', { uid, instance: instancePlugin.instance })
		}

		instancePlugin.events.on('ready', ({ instance }) => {
			this._instances.set(uid, instance)
			this.events.emit('instance:added', { uid, instance })
		})

		instancePlugin.events.on('removed', () => {
			this._instances.delete(uid)
			this.events.emit('instance:removed', { uid })
		})
	}

	/**
	 * Возвращает instance по uid компонента.
	 */
	getByUid(uid: string | number): IComponentView | null {
		return this._instances.get(uid) ?? null
	}

	/**
	 * Возвращает instance по индексу (в порядке регистрации, соответствует порядку v-for).
	 */
	getByIndex(index: number): IComponentView | null {
		return Array.from(this._instances.values())[index] ?? null
	}

	/**
	 * Возвращает uid по instance (reverse lookup).
	 */
	getUidByInstance(instance: IComponentView): string | number | null {
		for (const [uid, current] of this._instances) {
			if (current === instance) return uid
		}
		return null
	}

	/**
	 * Возвращает все зарегистрированные instance.
	 */
	getAll(): IComponentView[] {
		return Array.from(this._instances.values())
	}

	/**
	 * Возвращает только видимые instance (present === true).
	 */
	getVisible(): IComponentView[] {
		const result: IComponentView[] = []

		for (const instance of this._instances.values()) {
			if (instance.present) {
				result.push(instance)
			}
		}

		return result
	}
}
