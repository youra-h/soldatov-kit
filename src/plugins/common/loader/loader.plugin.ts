import { TBasePlugin } from '../../base/plugin'
import { TInstancePlugin } from '../instance'
import type { ILoader, IControl, TComponentSize, TComponentVariant, TValuePayload } from '@core'
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
	private _unwatchInstance?: () => void
	private _unwatchLoader?: () => void

	override install(bundle: IPluginBundle): void {
		this._bundle = bundle

		const instancePlugin = bundle.get(TInstancePlugin) as
			| TInstancePlugin<IControl>
			| undefined

		if (!instancePlugin?.instance) return

		const instance = instancePlugin.instance

		if ('size' in instance && 'variant' in instance) {
			const onSizeChange = (payload: TValuePayload<TComponentSize>) => {
				if (this._loader) this._loader.size = payload.newValue
			}
			const onVariantChange = (payload: TValuePayload<TComponentVariant>) => {
				if (this._loader) this._loader.variant = payload.newValue
			}

			instance.events.on('change:size', onSizeChange)
			instance.events.on('change:variant', onVariantChange)

			this._unwatchInstance = () => {
				instance.events.off('change:size', onSizeChange)
				instance.events.off('change:variant', onVariantChange)
			}
		}
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

		// Начальная установка size/variant (только если есть)
		if ('size' in instancePlugin.instance) {
			loader.size = instancePlugin.instance.size as TComponentSize
		}
		if ('variant' in instancePlugin.instance) {
			loader.variant = instancePlugin.instance.variant as TComponentVariant
		}

		// Отвязываем предыдущие подписки на лоадер
		this._unwatchLoader?.()

		const refresh = () => disableState.notify()
		loader.events.on('change:disabled', refresh)
		loader.events.on('change:visible', refresh)

		this._unwatchLoader = () => {
			loader.events.off('change:disabled', refresh)
			loader.events.off('change:visible', refresh)
		}
	}

	setContext(loader: ILoader): void {
		this._loader = loader
		this._link()
	}

	destroy(): void {
		this._unwatchLoader?.()
		this._unwatchInstance?.()
		this._loader = undefined
		this._bundle = undefined
		super.destroy()
	}
}
