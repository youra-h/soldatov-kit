import { TBasePlugin } from '../../base/plugin'
import type { IPlugin, IPluginBundle, TPluginConstructor } from '../../base/types'
import type { TCollectionItemPluginsEvents } from './types'

/**
 * Единый регистратор плагинов элементов коллекции.
 *
 * Накапливает item-бандлы по uid. Любой плагин может получить
 * плагин конкретного item'а через getPlugin(uid, PluginClass).
 *
 * Заменяет TElementAccumulationPlugin + TInstanceAccumulationPlugin.
 */
export class TCollectionItemPlugins extends TBasePlugin<TCollectionItemPluginsEvents> {
	static readonly key = 'collection-item-plugins'

	private readonly _bundles = new Map<string | number, IPluginBundle>()

	register(uid: string | number, bundle: IPluginBundle): void {
		this._bundles.set(uid, bundle)
		this.events.emit('item:registered', { uid, bundle })
	}

	unregister(uid: string | number): void {
		this._bundles.delete(uid)
		this.events.emit('item:unregistered', { uid })
	}

	getBundle(uid: string | number): IPluginBundle | undefined {
		return this._bundles.get(uid)
	}

	getPlugin<T extends IPlugin<any>>(uid: string | number, ctor: TPluginConstructor<T>): T | undefined {
		return this._bundles.get(uid)?.get(ctor)
	}
}
