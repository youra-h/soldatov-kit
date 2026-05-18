import type { ITabs, TTabsAppearance } from '../../../../core/components/tabs'
import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TInstancePlugin } from '../../instance'
import { TTabsLayoutPlugin } from '../layout'
import type { TTabsAppearancePluginEvents } from './types'

type TAppearanceHandler = () => void

export class TTabsAppearancePlugin extends TBasePlugin<TTabsAppearancePluginEvents> {
	static readonly key = 'tabs-appearance'

	private _element: HTMLElement | null = null
	private _tabs: ITabs | null = null

	// Map для обработчиков табов в зависимости от apperance
	private readonly _handlers: Partial<Record<TTabsAppearance, TAppearanceHandler>> = {
		line: () => this._updateLine(),
	}

	override install(bundle: IPluginBundle): void {
		bundle.get(TElementPlugin)?.events.on('ready', ({ element }) => {
			this._element = element

			if (this._tabs?.appearance === 'line') {
				this._tabs.classes.add('--ready-animation')
			}
		})

		bundle.get(TElementPlugin)?.events.on('removed', () => {
			this._element = null
		})

		bundle.get(TTabsLayoutPlugin)?.events.on('layout:change', () => this.update())

		// Получить instance плагин и подписаться на его событие ready, чтобы получить инстанс табов и подписаться на его события для обновления внешнего вида при изменении активного таба или внешнего вида
		const instancePlugin = bundle.get(TInstancePlugin) as TInstancePlugin<ITabs> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._tabs = instance

			instance.events.on('item:activated', () => this.update())
			instance.events.on('item:deleted', () => this.update())
			instance.events.on('item:moved', () => this.update())
			instance.events.on('item:deactivated', () => this.update())
			instance.events.on('change:appearance', () => this.update())
		})
	}

	override destroy(): void {
		this._element = null
		this._tabs = null

		super.destroy()
	}

	/**
	 * Вызывает обновление внешнего вида табов в зависимости от их текущего состояния и выбранного стиля (appearance)
	 * @returns
	 */
	update(): void {
		if (!this._tabs) return

		this._handlers[this._tabs.appearance]?.()
	}

	/**
	 * Обновляет позицию и размер линии под активным табом для стиля 'line'
	 * @returns
	 */
	private _updateLine(): void {
		if (!this._element) return

		const listCls = this._tabs!.classes.resolve(`__list`, { point: true })!

		const listEl = this._element.querySelector(listCls) as HTMLElement | null

		if (!listEl) {
			console.warn('TabsAppearancePlugin: List element not found with class', listCls)
			return
		}

		const activeItem = this._tabs!.activeItem
		const activeIndex = activeItem ? this._tabs!.collection.items.indexOf(activeItem) : -1
		const activeEl = activeIndex >= 0 ? (listEl.children[activeIndex] as HTMLElement) : null

		const offsetLeft = activeEl ? activeEl.offsetLeft : 0
		const offsetWidth = activeEl ? activeEl.offsetWidth : 0

		listEl.style.setProperty('--underline-x', `${offsetLeft}px`)
		listEl.style.setProperty('--underline-width', `${offsetWidth}px`)
	}
}
