import type { IComponentView } from '../../core/base/component-view'
import { TBasePlugin } from '../base/plugin'
import type { TInstancePluginEvents } from './types'

export class TInstancePlugin<T extends IComponentView = IComponentView>
	extends TBasePlugin<TInstancePluginEvents<T>> {
	static readonly key = 'instance'
	readonly key = TInstancePlugin.key

	private _instance: T | null = null

	setInstance(instance: T): void {
		this._instance = instance
		this.events.emit('instance:ready', instance)
	}

	onReady(handler: (instance: T) => void): void {
		if (this._instance) {
			handler(this._instance)
		}
		this.events.on('instance:ready', handler)
	}

	getContext() {
		return { instance: this._instance }
	}
}
