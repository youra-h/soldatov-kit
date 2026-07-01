import { TBasePlugin } from '../../base/plugin'
import type { IPlugin, IPluginBundle, TPluginConstructor } from '../../base/types'
import type { TCollectionItemPluginsEvents } from './types'

/**
 * Единый регистратор плагинов элементов коллекции.
 *
 * Накапливает item-бандлы по uid. Любой плагин может получить
 * плагин конкретного item'а через getPlugin(uid, PluginClass).
 *
 * Заменяет TCollectionElementsPlugin + TCollectionInstancesPlugin.
 */
export class TCollectionItemPlugins extends TBasePlugin<TCollectionItemPluginsEvents> {
	static readonly key = 'collection-item-plugins'

	private readonly _bundles = new Map<string | number, IPluginBundle>()

	register(uid: string | number, bundle: IPluginBundle): void {
		this._bundles.set(uid, bundle)
	}

	getBundle(uid: string | number): IPluginBundle | undefined {
		return this._bundles.get(uid)
	}

	getPlugin<T extends IPlugin<any>>(uid: string | number, ctor: TPluginConstructor<T>): T | undefined {
		return this._bundles.get(uid)?.get(ctor)
	}
}
