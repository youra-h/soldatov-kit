import { TBasePlugin } from '../../base/plugin'
import { TInstancePlugin } from '../instance'
import type { ILoader, IControl } from '@core'
import type { IPluginBundle } from '../../base/types'

export type TLoaderPluginEvents = {}

export class TLoaderPlugin extends TBasePlugin<TLoaderPluginEvents> {
	static readonly key = 'loader'

	private _loader?: ILoader

	get loader(): ILoader | undefined {
		return this._loader
	}

	setLoader(loader: ILoader): void {
		this._loader = loader
	}

	override install(bundle: IPluginBundle): void {
		const instancePlugin = bundle.get(TInstancePlugin) as TInstancePlugin<IControl> | undefined

		const disableState = instancePlugin?.instance?.states?.disabled

		if (disableState && this._loader) {
			const loader = this._loader
			disableState.setResolver((current) => current || loader.disabled)
		}
	}

	destroy(): void {
		this._loader = undefined
		super.destroy()
	}
}
