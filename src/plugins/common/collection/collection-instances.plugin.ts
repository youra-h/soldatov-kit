import type { IComponentView } from '../../../core'
import { TBasePlugin } from '../../base/plugin'
import { TInstancePlugin } from '../instance'
import type { IPluginBundle } from '../../base/types'
import type { TCollectionInstancesPluginEvents } from './types'

export class TCollectionInstancesPlugin extends TBasePlugin<TCollectionInstancesPluginEvents> {
	static readonly key = 'collection-instances'

	private readonly _instances = new Map<string | number, IComponentView>()

	get instances(): ReadonlyMap<string | number, IComponentView> {
		return this._instances
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
}
