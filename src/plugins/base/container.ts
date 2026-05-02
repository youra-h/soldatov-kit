import type { IPlugin, IPluginContainer, TPluginConstructor } from './types'

export class TPluginContainer implements IPluginContainer {
	private _plugins = new Map<string, IPlugin>()

	use<P extends IPlugin>(PluginCtor: TPluginConstructor<P>): P {
		const plugin = new PluginCtor()
		this._plugins.set(PluginCtor.key, plugin)
		plugin.install(this)
		return plugin
	}

	get<P extends IPlugin>(ctor: TPluginConstructor<P>): P | undefined
	get(key: string): IPlugin | undefined
	get<P extends IPlugin>(ctorOrKey: TPluginConstructor<P> | string): P | IPlugin | undefined {
		const key = typeof ctorOrKey === 'string' ? ctorOrKey : ctorOrKey.key
		return this._plugins.get(key) as P | undefined
	}

	remove<P extends IPlugin>(PluginCtor: TPluginConstructor<P>): void {
		const plugin = this._plugins.get(PluginCtor.key)
		plugin?.destroy()
		this._plugins.delete(PluginCtor.key)
	}
}
