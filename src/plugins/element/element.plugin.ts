import { TBasePlugin } from '../base/plugin'
import type { TElementPluginEvents } from './types'

export class TElementPlugin extends TBasePlugin<TElementPluginEvents> {
	static readonly key = 'element'
	readonly key = TElementPlugin.key

	private _element: HTMLElement | null = null

	setElement(el: HTMLElement | null): void {
		if (this._element === el) return

		const prev = this._element
		this._element = el

		if (el && !prev) {
			requestAnimationFrame(() => {
				if (this._element !== el) return
				this.events.emit('element:ready', el)
			})
		} else if (!el && prev) {
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
