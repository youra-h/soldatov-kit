import { TBasePlugin } from '../base/plugin'
import type { TElementPluginEvents } from './types'

export class TElementPlugin extends TBasePlugin<TElementPluginEvents> {
	static readonly key = 'element'
	readonly key = TElementPlugin.key

	private _element: HTMLElement | null = null

	setElement(el: HTMLElement | null): void {
		this._element = el

		if (el) {
			this.events.emit('element:ready', el)
		} else {
			this.events.emit('element:removed')
		}
	}

	onReady(handler: (el: HTMLElement) => void): void {
		if (this._element) {
			handler(this._element)
		}
		this.events.on('element:ready', handler)
	}

	getContext() {
		return { element: this._element }
	}
}
