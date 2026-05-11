import type { IComponentView } from '../../../core'
import { TBasePlugin } from '../../base'
import type { TInstancePluginEvents } from './types'
import { TEvented } from '../../../core/common/evented'

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

		if (value) {
			;(this.events as TEvented<TInstancePluginEvents<T>>).emit('ready', { instance: value })
		} else {
			;(this.events as TEvented<TInstancePluginEvents<T>>).emit('removed')
		}
	}

	getContext() {
		return { instance: this._instance }
	}
}
