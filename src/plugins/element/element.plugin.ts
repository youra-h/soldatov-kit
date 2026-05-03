import { TBasePlugin } from '../base/plugin'
import type { TElementPluginEvents } from './types'

export class TElementPlugin extends TBasePlugin<TElementPluginEvents> {
	static readonly key = 'element'

	private _element: HTMLElement | null = null

	get element(): HTMLElement | null {
		return this._element
	}

	set element(el: HTMLElement | null) {
		if (this._element === el) return

		const prev = this._element
		this._element = el

		if (el && !prev) {
			requestAnimationFrame(() => {
				if (this._element !== el) return

				this.events.emit('ready', { element: el })
			})
		} else if (!el && prev) {
			this.events.emit('removed')
		}
	}

	getContext() {
		return { element: this._element }
	}
}
