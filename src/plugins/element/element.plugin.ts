import { TBasePlugin } from '../base/plugin'
import type { TElementPluginEvents } from './types'

export class TElementPlugin extends TBasePlugin<TElementPluginEvents> {
	static readonly key = 'element'

	private _element: HTMLElement | null = null

	setElement(el: HTMLElement | null): void {
		this._element = el

		if (el) {
			this.events.emit('ready', { element: el })
		} else {
			this.events.emit('removed')
		}
	}

	getContext() {
		return { element: this._element }
	}
}
