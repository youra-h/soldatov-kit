import type { IComponentView } from '@core'
import { TInstancePlugin } from '../../instance'
import type { IPluginBundle } from '../../../base/types'
import { TAccumulationPlugin } from './accumulation.plugin'
import type { TInstanceAccumulationEvents } from './types'
import { TEvented } from '@core'

/**
 * Накопление инстансов элементов коллекции.
 *
 * Извлекает {@link IComponentView} из {@link TInstancePlugin} каждого item'а.
 *
 * @events
 * - `instance:added` — при появлении нового instance
 * - `instance:removed` — при удалении instance
 */
export class TInstanceAccumulationPlugin extends TAccumulationPlugin<
	IComponentView,
	TInstanceAccumulationEvents
> {
	static readonly key = 'collection-instances'

	protected _track(uid: string | number, bundle: IPluginBundle): void {
		const instancePlugin = bundle.get(TInstancePlugin)

		if (!instancePlugin) return

		// Если instance уже готов — добавляем сразу
		if (instancePlugin.instance) {
			this._add(uid, instancePlugin.instance)
		}

		instancePlugin.events.on('ready', ({ instance }) => {
			this._add(uid, instance)
		})

		instancePlugin.events.on('removed', () => {
			this._remove(uid)
		})
	}

	protected override _add(uid: string | number, instance: IComponentView): void {
		super._add(uid, instance)
		;(this.events as TEvented<TInstanceAccumulationEvents>).emit('instance:added', {
			uid,
			instance,
		})
	}

	protected override _remove(uid: string | number): void {
		super._remove(uid)
		;(this.events as TEvented<TInstanceAccumulationEvents>).emit('instance:removed', { uid })
	}
}
