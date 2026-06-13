import { TBasePlugin } from '../../base/plugin'
import { TInstancePlugin } from '../instance'
import type { ILoader, IControl } from '@core'
import type { IPluginBundle } from '../../base/types'

export type TLoaderPluginEvents = {}

/**
 * Плагин для управления состоянием загрузки в компонентах. Позволяет связать состояние загрузчика (ILoader) с контролами, обеспечивая автоматическое управление состоянием disabled у контролов на основе состояния загрузчика.
 * Если загрузчик активен (disabled: true), то связанные контролы также будут дизейблены. Если загрузчик неактивен (disabled: false), то контролы будут возвращаться в свое обычное состояние (зависит от их собственного состояния).
 * Это обеспечивает удобство использования и согласованность интерфейса, позволяя автоматически управлять состоянием контролов на основе состояния загрузчика.
 */
export class TLoaderPlugin extends TBasePlugin<TLoaderPluginEvents> {
	static readonly key = 'loader'

	private _loader?: ILoader
	private _bundle?: IPluginBundle
	private _unwatch?: () => void

	override install(bundle: IPluginBundle): void {
		this._bundle = bundle
		this._link()
	}

	get loader(): ILoader | undefined {
		return this._loader
	}

	/**
	 * Связывает состояние disabled у индикатора загрузки и контролов, если оба плагина установлены.
	 * Если загрузчик активен (disabled: true), то связанные контролы также будут дизейблены.
	 * Если загрузчик неактивен (disabled: false), то контролы будут возвращаться в свое обычное состояние (зависит от их собственного состояния).
	 * Это позволяет автоматически управлять состоянием контролов на основе состояния загрузчика, обеспечивая удобство использования и согласованность интерфейса.
	 */
	private _link(): void {
		if (!this._loader || !this._bundle) return

		const instancePlugin = this._bundle.get(TInstancePlugin) as
			| TInstancePlugin<IControl>
			| undefined

		if (!instancePlugin?.instance) return

		const disableState = instancePlugin.instance.states.disabled
		const loader = this._loader

		disableState.setResolver((value) => value || (loader.visible && loader.disabled))

		// Отвязываем предыдущие подписки если есть
		this._unwatch?.()

		const refresh = () => disableState.notify()

		loader.events.on('change:disabled', refresh)
		loader.events.on('change:visible', refresh)

		this._unwatch = () => {
			loader.events.off('change:disabled', refresh)
			loader.events.off('change:visible', refresh)
		}
	}

	setContext(loader: ILoader): void {
		this._loader = loader
		this._link()
	}

	destroy(): void {
		this._unwatch?.()
		this._loader = undefined
		this._bundle = undefined
		super.destroy()
	}
}
