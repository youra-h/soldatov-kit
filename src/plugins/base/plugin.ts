import { TEvented } from '../../core/common/evented'
import type { IPlugin, IPluginContainer, TPluginEvents } from './types'

export abstract class TBasePlugin<
	TCustomEvents extends Record<string, (...args: any) => any> = {}
> implements IPlugin<TPluginEvents<TCustomEvents>> {
	abstract readonly key: string

	readonly events = new TEvented<TPluginEvents<TCustomEvents>>()

	protected _container: IPluginContainer | null = null

	install(container: IPluginContainer): void {
		this._container = container
	}

	destroy(): void {
		this.events.emit('destroyed')
		this._container = null
	}
}
