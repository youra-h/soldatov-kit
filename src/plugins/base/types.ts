import type { TEvented } from '../../core/common/evented'

export type TBasePluginEvents = {
	destroyed: () => void
}

export type TPluginEvents<T extends Record<string, (...args: any) => any> = {}> =
	T & TBasePluginEvents

export interface IPlugin<TEvents extends TBasePluginEvents = TBasePluginEvents> {
	readonly key: string
	readonly events: TEvented<TEvents>
	/** Вызывается контейнером при добавлении плагина через use(). Используй для подписки на другие плагины. */
	install(container: IPluginContainer): void
	/** Вызывается контейнером при удалении через remove(). Используй для отписки от событий и очистки ресурсов. */
	destroy(): void
}

export interface IPluginContainer {
	use<P extends IPlugin>(PluginCtor: TPluginConstructor<P>): P
	get<P extends IPlugin>(ctor: TPluginConstructor<P>): P | undefined
	get(key: string): IPlugin | undefined
	remove<P extends IPlugin>(PluginCtor: TPluginConstructor<P>): void
}

export type TPluginConstructor<P extends IPlugin = IPlugin> = {
	new(): P
	readonly key: string
}
