// composables/useInstanceBinding.ts (если хотим отдельно)
import { type Reactive, toRaw } from 'vue'
import type { IComponent } from '@core'
import type { IPluginBundle } from '@plugins/base'
import { TInstancePlugin } from '@plugins/common/instance'

/**
 * Утилита для привязки реактивного инстанса к `TInstancePlugin` внутри бандла.
 * Позволяет легко синхронизировать реактивный инстанс с `TInstancePlugin` в бандле.
 * @param bundle - бандл, содержащий `TInstancePlugin`, который будет синхронизирован с реактивным инстансом.
 * @param instance - реактивный инстанс, который будет привязан к `TInstancePlugin`.
 */
export function useInstanceBinding(bundle: IPluginBundle, instance: Reactive<IComponent>) {
	bundle.get(TInstancePlugin)!.instance = toRaw(instance) as IComponent
}
