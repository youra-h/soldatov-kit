import { type TLoaderTypeIndicator, type TLoaderType, type ILoader } from '@/core'
import { provide, inject, type InjectionKey, type Component } from 'vue'
import Spinner from '../components/spinner/Spinner.vue'
import Icon from '../components/icon/Icon.vue'

export interface ILoaderHost {
	ctrl: TLoaderTypeIndicator
	indicator: boolean
	visible: boolean
	/** Vue-компонент для рендера. null — не нужно рендерить */
	component: Component | null
}

export const LOADER_KEY: InjectionKey<ILoaderHost> = Symbol('loader')

/**
 * Определяет компонент индикатора загрузки для текущего типа и состояния загрузки
 * @param type Тип индикатора
 * @returns Vue-компонент для рендера. null — не нужно рендерить
 */
function resolveIndicatorComponent(type: TLoaderType): Component | null {
	if (type === 'spinner') return Spinner
	if (type === 'icon') return Icon

	return null
}

export function useProvideLoader(loader: ILoader): void {
	provide(LOADER_KEY, {
		get ctrl() {
			return loader.ctrl
		},
		get indicator() {
			return loader.indicator
		},
		get visible() {
			return loader.visible
		},
		get component() {
			if (!loader.indicator || !loader.visible) return null

			return resolveIndicatorComponent(loader.type)
		},
	})
}

export function useInjectLoader(): ILoaderHost | null {
	return inject(LOADER_KEY, null)
}
