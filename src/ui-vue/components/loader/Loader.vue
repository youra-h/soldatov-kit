<script lang="ts">
import type { PropType } from 'vue'
import { inject, provide, type InjectionKey } from 'vue'
import type { ILoader, TLoaderIndicator } from '@core'
import { TLoader } from '@core'
import { useInstance } from '../../composables/useInstance'

export const LOADER_KEY: InjectionKey<ILoader> = Symbol('loader')

export function useParentLoader(): ILoader | undefined {
	return inject(LOADER_KEY, undefined)
}

export default {
	name: '_Loader',
	props: {
		ctrl: { type: Object as PropType<ILoader>, default: undefined },
		visible: { type: Boolean, default: undefined },
		loader: { type: String as PropType<TLoaderIndicator>, default: undefined },
	},
	setup(props: { ctrl?: ILoader; visible?: boolean; loader?: TLoaderIndicator }) {
		const instance = useInstance(TLoader, props) as ILoader
		provide(LOADER_KEY, instance)
		return { instance }
	},
}
</script>

<template>
	<slot />
</template>
