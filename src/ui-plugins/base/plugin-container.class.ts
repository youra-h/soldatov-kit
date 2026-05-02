import { TEvented } from '../../../core/common/evented'
import type { IPlugin, IPluginContainer, IPluginCtor, TPluginContainerEvents } from './types'

/**
 * Контейнер для плагинов.
 *
 * Управляет плагинами и оповещает подписчиков об их добавлении.
 */
export class TPluginContainer implements IPluginContainer {
	readonly events = new TEvented<TPluginContainerEvents>()
	private _plugins = new Map<string, IPlugin<any>>()

	use<T extends IPlugin<any>>(Ctor: IPluginCtor<T>): T {
		const key = Ctor.key

		// Если плагин с таким ключом уже был — удаляем старый
		if (this._plugins.has(key)) {
			this.remove(key)
		}

		// 1. Создаем плагин через конструктор
		const plugin = new Ctor()
		this._plugins.set(key, plugin)

		// 2. Сразу передаем ему контейнер
		plugin.setContext({ container: this })

		// 3. Эмитим событие install, чтобы другие плагины или Vue узнали о нем
		this.events.emit('install', { plugin, key })

		return plugin
	}

	get<T extends IPlugin<any>>(key: string): T | undefined {
		return this._plugins.get(key) as T | undefined
	}

	remove(key: string): void {
		const plugin = this._plugins.get(key)
		if (plugin) {
			plugin.uninstall()
			this._plugins.delete(key)
		}
	}
}
