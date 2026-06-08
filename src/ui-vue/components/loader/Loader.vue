<script lang="ts">
import { inject, provide, type InjectionKey } from 'vue'
import { TLoader, type ILoader, type ILoaderProps } from '@core'
import { useInstance } from '../../composables/useInstance'
import BaseLoader from './base.component'
import type { TBaseComponentViewProps } from '../component-view'

export const LOADER_KEY: InjectionKey<ILoader> = Symbol('loader')

export function useParentLoader(): ILoader | undefined {
	return inject(LOADER_KEY, undefined)
}

export default {
	name: '_Loader',
	extends: BaseLoader,
	setup(props: TBaseComponentViewProps<ILoaderProps, ILoader>) {
		const instance = useInstance(TLoader, props)
		provide(LOADER_KEY, instance)
		return { instance }
	},
}
</script>

<template>
	<slot />
</template>

