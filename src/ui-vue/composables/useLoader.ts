import { type TLoaderTypeIndicator, type TLoaderType, type ILoader } from '@/core'
import { provide, inject, computed, type InjectionKey, type Component } from 'vue'
import { useSyncProps } from './useSyncProps'
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

function resolveIndicatorComponent(type: TLoaderType): Component | null {
	if (type === 'spinner') return Spinner
	if (type === 'icon') return Icon
	return null
}

export function useProvideLoader(loader: ILoader): void {
	const { visible, indicator, type } = useSyncProps(loader.events, {
		visible: () => loader.visible,
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
		get indicator() {
			return indicator.value
		},
		get visible() {
			return visible.value
		},
		get component() {
			return component.value
		},
	})
}

export function useInjectLoader(): ILoaderHost | null {
	return inject(LOADER_KEY, null)
}
