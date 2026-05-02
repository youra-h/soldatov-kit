import { TEvented } from '../../core/common/evented'
import type { IPlugin, IPluginContainer, TPluginEvents } from './types'

export abstract class TBasePlugin<
	TCustomEvents extends Record<string, (...args: any) => any> = {}
> implements IPlugin<TPluginEvents<TCustomEvents>> {
	get key(): string {
		return (this.constructor as unknown as { key: string }).key
	}

	readonly events = new TEvented<TPluginEvents<TCustomEvents>>()

	protected _container: IPluginContainer | null = null

	attach(container: IPluginContainer): void {
		this._container = container
	}

	detach(): void {
		this.events.emit('detached')
		this._container = null
	}
}
