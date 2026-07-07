import { TBasePlugin } from '../../base'
import type { TInstancePluginEvents } from './types'
import { TEvented, type IComponent } from '@core'

export class TInstancePlugin<T extends IComponent = IComponent> extends TBasePlugin<
	TInstancePluginEvents<T>
> {
	static readonly key = 'instance'

	private _instance: T | null = null
	private _readyResolve: ((instance: T) => void) | null = null

	get instance(): T | null {
		return this._instance
	}

	set instance(value: T | null) {
		if (this._instance === value) return

		this._instance = value

		if (value) {
			this._readyResolve?.(value)
			this._readyResolve = null
				; (this.events as TEvented<TInstancePluginEvents<T>>).emit('ready', { instance: value })
		} else {
			; (this.events as TEvented<TInstancePluginEvents<T>>).emit('removed')
		}
	}

	/**
	 * Возвращает Promise, который резолвится когда instance готов.
	 * Если instance уже установлен — резолвится немедленно.
	 */
	ready(): Promise<T> {
		if (this._instance) {
			return Promise.resolve(this._instance)
		}

		return new Promise<T>((resolve) => {
			this._readyResolve = resolve
		})
	}

	getContext() {
		return { instance: this._instance }
	}
}
