import type { IComponentView } from '../../core/base/component-view'
import { TBasePlugin } from '../base/plugin'
import type { TInstancePluginEvents } from './types'

export class TInstancePlugin<T extends IComponentView = IComponentView>
	extends TBasePlugin<TInstancePluginEvents<T>> {
	static readonly key = 'instance'

	private _instance: T | null = null

	setInstance(instance: T): void {
		this._instance = instance
		this.events.emit('ready', { instance })
	}

	getContext() {
		return { instance: this._instance }
	}
}
