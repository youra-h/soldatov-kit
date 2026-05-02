import { TPlugin } from '../base/plugin.class'
import { TDomPlugin } from '../dom/dom.plugin'
import { TCorePlugin } from '../core/core.plugin'
import type { IPluginContext } from '../base/types'

/**
 * Пример плагина, который обрабатывает индикатор табов.
 */
export class TLineIndicatorPlugin extends TPlugin {
	static readonly key = 'line-indicator-plugin'

	private _tabsInstance: any // Тут был бы ITabs
	private _domPlugin: TDomPlugin | undefined

	// Обработчики:
	private _onActivated = () => requestAnimationFrame(() => this.update())
	private _onMount = (el: Element) => this.update()

	override setContext(context: Partial<IPluginContext>): void {
		// Первое — всегда вызываем super для обновления _container
		super.setContext(context)

		// 1. Как только мы получили container — можем найти TCorePlugin и TDomPlugin
		if ('container' in context && this.container) {
			const corePlugin = this.container.get<TCorePlugin>(TCorePlugin.key)
			const domPlugin = this.container.get<TDomPlugin>(TDomPlugin.key)

			// Если CorePlugin уже есть, получаем instance от него
			if (corePlugin) {
				if (corePlugin.instance) this._setupInstance(corePlugin.instance)
				corePlugin.events.on('ready', (instance) => this._setupInstance(instance))
			}

			// Если TDomPlugin уже есть - подписываемся на mount и сразу вызываем если el там уже есть
			if (domPlugin) {
				this._domPlugin = domPlugin
				domPlugin.events.on('mount', this._onMount)
				if (domPlugin.el) this.update()
			}
		}
	}

	private _setupInstance(instance: any) {
		this._tabsInstance = instance
		this._tabsInstance.events.on('item:activated', this._onActivated)
		this._tabsInstance.events.on('item:deleted', this._onActivated)
	}

	public update(): void {
		const el = this._domPlugin?.el
		const tabs = this._tabsInstance

		if (!el || !tabs || tabs.appearance !== 'line') return

		const listEl = el.querySelector('.s-tabs__list') as HTMLElement | null
		const activeEl = tabs.activeItem?.el as HTMLElement | null

		if (listEl && activeEl) {
			listEl.style.setProperty('--underline-x', `${activeEl.offsetLeft}px`)
			listEl.style.setProperty('--underline-width', `${activeEl.offsetWidth}px`)
		}
	}

	override uninstall(): void {
		if (this._tabsInstance) {
			this._tabsInstance.events.off('item:activated', this._onActivated)
			this._tabsInstance.events.off('item:deleted', this._onActivated)
		}
		if (this._domPlugin) {
			this._domPlugin.events.off('mount', this._onMount)
		}
	}
}
