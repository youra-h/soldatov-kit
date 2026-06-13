import { type TLoaderType, type ILoader } from '@/core'
import { provide, inject, type InjectionKey, type Component } from 'vue'
import Spinner from '../components/spinner/Spinner.vue'
import Icon from '../components/icon/Icon.vue'

export interface ILoaderContext {
	loader: ILoader
}

export const LOADER_KEY: InjectionKey<ILoaderContext> = Symbol('loader')

export function useResolveIndicatorComponent(type: TLoaderType): Component | null {
	if (type === 'spinner') return Spinner
	if (type === 'icon') return Icon
	return null
}

/**
 * Провайдит в контекст данные для рендера индикатора загрузки и его состояния.
 * Компоненты, которые хотят использовать эти данные, могут вызвать `useInjectLoader` и отрендерить индикатор по своему усмотрению.
 * Провайдер должен быть выше по иерархии компонентов, чем компоненты, которые хотят использовать индикатор загрузки.
 * @param loader
 */
export function useProvideLoader(loader: ILoader): void {
	provide(LOADER_KEY, { loader })
}

/**
 * Инжектит из контекста данные для рендера индикатора загрузки и его состояния.
 * Компоненты могут использовать эти данные для рендера индикатора загрузки в своём шаблоне.
 * Если провайдера нет, возвращает null. В этом случае компонент может не рендерить индикатор загрузки вообще или рендерить его в каком-то дефолтном виде.
 * @returns Данные для рендера индикатора загрузки и его состояния, или null если провайдера нет в иерархии компонентов
 */
export function useInjectLoader(): ILoaderContext | null {
	return inject(LOADER_KEY, null)
}
