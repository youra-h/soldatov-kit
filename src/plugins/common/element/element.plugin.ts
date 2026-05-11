import { TBasePlugin } from '../../base'
import type { TElementPluginEvents } from './types'
import { TEvented } from '../../../core/common/evented'

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

				;(this.events as TEvented<TElementPluginEvents>).emit('ready', { element: el })
			})
		} else if (!el && prev) {
			;(this.events as TEvented<TElementPluginEvents>).emit('removed')
		}
	}

	getContext() {
		return { element: this._element }
	}
}
