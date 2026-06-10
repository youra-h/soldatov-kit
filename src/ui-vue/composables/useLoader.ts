import { type TLoaderTypeIndicator, type TLoaderType, type ILoader } from '@/core'
import { provide, inject, computed, type InjectionKey, type Component } from 'vue'
import { useSyncProps } from './useSyncProps'
import Spinner from '../components/spinner/Spinner.vue'
import Icon from '../components/icon/Icon.vue'

export interface ILoaderHost extends Partial<ILoader> {
	/** Vue-компонент для рендера. null — не нужно рендерить */
	component: Component | null
}

export const LOADER_KEY: InjectionKey<ILoaderHost> = Symbol('loader')

function resolveIndicatorComponent(type: TLoaderType): Component | null {
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
	const { visible, indicator, type } = useSyncProps(loader.events, {
		visible: () => loader.visible,
		disabled: () => loader.disabled,
		indicator: () => loader.indicator,
		type: () => loader.type,
		// ctrl: { value: () => loader.ctrl, events: ['change:type', 'change:indicator'] },
	})

	const component = computed(() => {
		if (!indicator.value || !visible.value) return null
		return resolveIndicatorComponent(type.value)
	})

	provide(LOADER_KEY, {
		get ctrl() {
			return loader.ctrl
		},
		get visible() {
			return visible.value
		},
		get disabled() {
			return loader.disabled
		},
		get indicator() {
			return indicator.value
		},
		get component() {
			return component.value
		},
	})
}

/**
 * Инжектит из контекста данные для рендера индикатора загрузки и его состояния.
 * Компоненты могут использовать эти данные для рендера индикатора загрузки в своём шаблоне.
 * Если провайдера нет, возвращает null. В этом случае компонент может не рендерить индикатор загрузки вообще или рендерить его в каком-то дефолтном виде.
 * @returns Данные для рендера индикатора загрузки и его состояния, или null если провайдера нет в иерархии компонентов
 */
export function useInjectLoader(): ILoaderHost | null {
	return inject(LOADER_KEY, null)
}
