import { type TLoaderTypeIndicator, type TLoaderType, type ILoader } from '@/core'
import { provide, inject, computed, type InjectionKey, type Component } from 'vue'
import { useEventState } from './useEventState'
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
	const visibleRef = useEventState(loader.events, () => loader.visible, ['change:visible'])
	const indicatorRef = useEventState(loader.events, () => loader.indicator, ['change:indicator'])
	const typeRef = useEventState(loader.events, () => loader.type, ['change:type'])
	const ctrlRef = useEventState(loader.events, () => loader.ctrl, ['change:type', 'change:indicator'])

	const component = computed(() => {
		if (!indicatorRef.value || !visibleRef.value) return null
		return resolveIndicatorComponent(typeRef.value)
	})

	provide(LOADER_KEY, {
		get ctrl() { return ctrlRef.value },
		get indicator() { return indicatorRef.value },
		get visible() { return visibleRef.value },
		get component() { return component.value },
	})
}

export function useInjectLoader(): ILoaderHost | null {
	return inject(LOADER_KEY, null)
}
