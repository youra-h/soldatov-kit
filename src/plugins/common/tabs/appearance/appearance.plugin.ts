import type { ITabs, TTabsAppearance } from '../../../../core/components/tabs'
import type { IPluginBundle } from '../../../base/types'
import { TBasePlugin } from '../../../base/plugin'
import { TElementPlugin } from '../../element'
import { TInstancePlugin } from '../../instance'
import { TTabsLayoutPlugin } from '../layout'
import { TCollectionElementsPlugin } from '../../collection'
import type { TTabsAppearancePluginEvents } from './types'

type TAppearanceHandler = () => void

export class TTabsAppearancePlugin extends TBasePlugin<TTabsAppearancePluginEvents> {
	static readonly key = 'tabs-appearance'

	private _element: HTMLElement | null = null
	private _tabs: ITabs | null = null
	private _collectionElements: TCollectionElementsPlugin | null = null

	// Map для обработчиков табов в зависимости от apperance
	private readonly _handlers: Partial<Record<TTabsAppearance, TAppearanceHandler>> = {
		line: () => this._updateLine(),
		outline: () => this._updateOutline(),
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

		this._collectionElements = bundle.get(TCollectionElementsPlugin) ?? null

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
		this._collectionElements = null

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

	private _getActiveTabOffset(): { listEl: HTMLElement; offsetLeft: number; offsetWidth: number } | null {
		if (!this._element || !this._collectionElements) return null

		const listCls = this._tabs!.classes.resolve(`__list`, { point: true })!
		const listEl = this._element.querySelector(listCls) as HTMLElement | null

		if (!listEl) return null

		const activeItem = this._tabs!.activeItem
		const activeEl = activeItem ? this._collectionElements.getByUid(activeItem.uid) : null

		return {
			listEl,
			offsetLeft: activeEl ? activeEl.offsetLeft : 0,
			offsetWidth: activeEl ? activeEl.offsetWidth : 0,
		}
	}

	private _updateOutline(): void {
		const result = this._getActiveTabOffset()
		if (!result) return

		const { listEl, offsetLeft, offsetWidth } = result

		listEl.style.setProperty('--gap-x', `${offsetLeft + 1}px`)
		listEl.style.setProperty('--gap-width', `${offsetWidth - 2}px`)
	}

	private _updateLine(): void {
		// Срабатывает событие deactivated, activeItem уже сброшен, чтобы анимация не скакала, когда offsetLeft/offsetWidth активного таба становятся 0, заранее проверяем, есть ли еще enabled табы, если нет — не обновляем позицию underline, чтобы он не прыгал в начало при деактивации последнего активного таба
		if (!this._tabs!.activeItem && this._tabs!.hasEnabledTabs()) return

		const result = this._getActiveTabOffset()
		if (!result) return

		const { listEl, offsetLeft, offsetWidth } = result

		listEl.style.setProperty('--underline-x', `${offsetLeft}px`)
		listEl.style.setProperty('--underline-width', `${offsetWidth}px`)
	}
}
