import type { IComponentView } from '../../core/base/component-view'
import { TBasePlugin } from '../base/plugin'
import type { TInstancePluginEvents } from './types'

export class TInstancePlugin<T extends IComponentView = IComponentView> extends TBasePlugin<
	TInstancePluginEvents<T>
> {
	static readonly key = 'instance'

	private _instance: T | null = null

	get instance(): T | null {
		return this._instance
	}

	set instance(value: T | null) {
		if (this._instance === value) return

		this._instance = value

		this.events.emit('ready', { instance: value })
	}

	getContext() {
		return { instance: this._instance }
	}
}
