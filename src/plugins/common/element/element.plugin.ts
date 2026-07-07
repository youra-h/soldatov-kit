import { TBasePlugin } from '../../base'
import type { TElementPluginEvents } from './types'
import { TEvented } from '@core'

export class TElementPlugin extends TBasePlugin<TElementPluginEvents> {
	static readonly key = 'element'

	private _element: HTMLElement | null = null
	private _readyResolve: ((element: HTMLElement) => void) | null = null

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

				this._readyResolve?.(el)
				this._readyResolve = null
				;(this.events as TEvented<TElementPluginEvents>).emit('ready', { element: el })
			})
		} else if (!el && prev) {
			;(this.events as TEvented<TElementPluginEvents>).emit('removed')
		}
	}

	/**
	 * Возвращает Promise, который резолвится когда элемент готов (в DOM после requestAnimationFrame).
	 * Если элемент уже установлен — резолвится немедленно.
	 */
	ready(): Promise<HTMLElement> {
		if (this._element) {
			return Promise.resolve(this._element)
		}

		return new Promise<HTMLElement>((resolve) => {
			this._readyResolve = resolve
		})
	}

	getContext() {
		return { element: this._element }
	}
}
