import type { IFrame, TFramePosition } from '@core'
import type { IPluginBundle } from '../../base/types'
import { TBasePlugin } from '../../base/plugin'
import { TInstancePlugin } from '../instance'
import { toCssValue } from '../../base/css-value'
import type { TFrameStylePluginEvents } from './types'
import { TEvented } from '@core'

/**
 * Плагин для управления CSS-стилями Frame (позиционирование + z-index + anchor).
 *
 * Подписывается на события TFrame (change:x, change:y, change:width, change:height, change:zIndex, change:position)
 * и вычисляет объект стилей для применения к DOM-элементу.
 *
 * При установке anchor-элемента через {@link setAnchor} координаты x/y
 * становятся отступом относительно anchor. При скролле/ресайзе позиция
 * пересчитывается через getBoundingClientRect.
 *
 * @example
 * const bundle = createFrameBundle()
 * const stylePlugin = bundle.get(TFrameStylePlugin)!
 * stylePlugin.setAnchor(someButton)
 * // stylePlugin.styles → { position: 'fixed', left: '100px', top: '200px', zIndex: 1001 }
 */
export class TFrameStylePlugin extends TBasePlugin<TFrameStylePluginEvents> {
	static readonly key = 'frame-style'

	protected _styles: Record<string, string | number> = {}
	protected _frame: IFrame | null = null
	protected _anchor: HTMLElement | null = null
	protected _anchorOffsets: { x: number; y: number } = { x: 0, y: 0 }
	protected _scrollCleanups: Array<() => void> = []

	override install(bundle: IPluginBundle): void {
		const instancePlugin = bundle.get(TInstancePlugin) as TInstancePlugin<IFrame> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._frame = instance as unknown as IFrame
			this._bindFrame(this._frame)
		})
	}

	/**
	 * Установить якорный элемент. Frame будет позиционироваться относительно него.
	 * @param element - DOM-элемент, относительно которого позиционировать Frame
	 */
	setAnchor(element: HTMLElement): void {
		this._anchor = element
		this._anchorOffsets = { x: this._frame?.x ?? 0, y: this._frame?.y ?? 0 }
		this._subscribeScroll()
		this._update()
			; (this.events as TEvented<TFrameStylePluginEvents>).emit('change:anchor', element)
	}

	/**
	 * Сбросить якорный элемент. Frame вернётся к позиционированию по x/y.
	 */
	removeAnchor(): void {
		this._anchor = null
		this._unsubscribeScroll()
		this._update()
			; (this.events as TEvented<TFrameStylePluginEvents>).emit('change:anchor', null)
	}

	/**
	 * Текущий якорный элемент или null.
	 */
	get anchor(): HTMLElement | null {
		return this._anchor
	}

	/**
	 * Текущий объект стилей для Frame.
	 * Включает position, left, top, width, height, z-index.
	 */
	get styles(): Record<string, string | number> {
		return this._styles
	}

	private _bindFrame(frame: IFrame): void {
		const update = () => this._update()

			; (frame as any).events.on('change:x', update)
			; (frame as any).events.on('change:y', update)
			; (frame as any).events.on('change:width', update)
			; (frame as any).events.on('change:height', update)
			; (frame as any).events.on('change:zIndex', update)
			; (frame as any).events.on('change:position', update)

		this._update()
	}

	private _update(): void {
		if (!this._frame) return

		const styles: Record<string, string | number> = {}

		// CSS-позиционирование
		styles['position'] = this._frame.position

		// Координаты: с учётом anchor или напрямую из frame
		let left = this._frame.x
		let top = this._frame.y

		if (this._anchor && this._frame.position === 'fixed') {
			const rect = this._anchor.getBoundingClientRect()
			left = rect.left + this._anchorOffsets.x
			top = rect.top + this._anchorOffsets.y
		}

		styles['left'] = toCssValue(left)
		styles['top'] = toCssValue(top)

		if (this._frame.width !== undefined) {
			styles['width'] = toCssValue(this._frame.width)
		}
		if (this._frame.height !== undefined) {
			styles['height'] = toCssValue(this._frame.height)
		}

		styles['z-index'] = this._frame.zIndex

		this._styles = styles
			; (this.events as any).emit('change:styles', this._styles)
	}

	private _subscribeScroll(): void {
		this._unsubscribeScroll()

		if (!this._anchor) return

		let el: HTMLElement | null = this._anchor.parentElement

		while (el) {
			const scrollHandler = () => this._update()
			el.addEventListener('scroll', scrollHandler, { passive: true })
			this._scrollCleanups.push(() => el?.removeEventListener('scroll', scrollHandler))
			el = el.parentElement
		}

		// Также подписываемся на resize окна
		const resizeHandler = () => this._update()
		window.addEventListener('resize', resizeHandler, { passive: true })
		this._scrollCleanups.push(() => window.removeEventListener('resize', resizeHandler))
	}

	private _unsubscribeScroll(): void {
		for (const cleanup of this._scrollCleanups) {
			cleanup()
		}
		this._scrollCleanups = []
	}

	override destroy(): void {
		this._unsubscribeScroll()
		this._frame = null
		this._anchor = null
		super.destroy()
	}
}
