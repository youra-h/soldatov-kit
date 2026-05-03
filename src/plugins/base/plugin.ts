import { TEvented } from '../../core/common/evented'
import type { IPlugin, IPluginContainer, TPluginEvents } from './types'

export abstract class TBasePlugin<
	TCustomEvents extends Record<string, (...args: any) => any> = {},
> implements IPlugin<TPluginEvents<TCustomEvents>> {
	get key(): string {
		return (this.constructor as unknown as { key: string }).key
	}

	readonly events = new TEvented<TPluginEvents<TCustomEvents>>()

	install(_container: IPluginContainer): void {}

	destroy(): void {
		this.events.emit('destroyed')
	}
}
