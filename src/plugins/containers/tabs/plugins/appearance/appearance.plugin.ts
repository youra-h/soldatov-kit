import type { ITabs, TTabsAppearance } from '../../../../../core/components/tabs'
import type { IPluginContainer } from '../../../../base/types'
import { TBasePlugin } from '../../../../base/plugin'
import { TElementPlugin } from '../../../../common/element'
import { TInstancePlugin } from '../../../../common/instance'
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

	override install(container: IPluginContainer): void {
		container.get(TElementPlugin)?.events.on('ready', ({ element }) => {
			this._element = element
			this.update()
		})

		container.get(TElementPlugin)?.events.on('removed', () => {
			this._element = null
		})

		// Получить instance плагин и подписаться на его событие ready, чтобы получить инстанс табов и подписаться на его события для обновления внешнего вида при изменении активного таба или внешнего вида
		const instancePlugin = container.get(TInstancePlugin) as TInstancePlugin<ITabs> | undefined

		instancePlugin?.events.on('ready', ({ instance }) => {
			this._tabs = instance

			instance.events.on('item:activated', () => this.update())
			instance.events.on('item:deactivated', () => this.update())
			instance.events.on('change:appearance', () => this.update())

			this.update()
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

		const listEl = this._element.querySelector('.s-tabs__list') as HTMLElement | null
		if (!listEl) return

		const activeItem = this._tabs!.activeItem
		const activeIndex = activeItem ? this._tabs!.collection.items.indexOf(activeItem) : -1
		const activeEl = activeIndex >= 0 ? (listEl.children[activeIndex] as HTMLElement) : null

		const offsetLeft = activeEl ? activeEl.offsetLeft : 0
		const offsetWidth = activeEl ? activeEl.offsetWidth : 0

		listEl.style.setProperty('--underline-x', `${offsetLeft}px`)
		listEl.style.setProperty('--underline-width', `${offsetWidth}px`)
	}
}
