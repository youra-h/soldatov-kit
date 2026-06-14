<script lang="ts">
import { TLoader, type ILoader, type ILoaderProps } from '@core'
import { useInstance } from '../../composables/useInstance'
import BaseLoader, { syncLoader } from './base.component'
import type { TBaseComponentProps } from '../component'

export default {
	name: '_Loader',
	extends: BaseLoader,
	setup(props: TBaseComponentProps<ILoaderProps, ILoader>, { emit }) {
		const instance = useInstance(TLoader, props)

		syncLoader({ props, instance, emit })

		return { instance }
	},
}
</script>

<template>
	<slot />
</template>
