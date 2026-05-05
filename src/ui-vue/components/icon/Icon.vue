<script lang="ts">
import { TIcon, type IIconProps, type IIcon } from '@core'
import { useInstance } from '../../composables/useInstance'
import { usePlugins } from '../../composables/usePlugins'
import BaseIcon, { syncIcon } from './base.component'
import { TComponentViewContainer } from '@plugins'
import type { TBaseComponentViewProps } from '../component-view'

export default {
	name: '_Icon',
	extends: BaseIcon,
	setup(props: TBaseComponentViewProps<IIconProps, IIcon>, { emit }) {
		const instance = useInstance(TIcon, props)
		const { plugins, rootRef } = usePlugins(TComponentViewContainer, props?.plugins, instance)

		syncIcon({
			props,
			instance,
			plugins,
			emit,
		})

		return {
			instance,
			plugins,
			rootRef,
		}
	},
}
</script>

<template>
	<component
		ref="rootRef"
		:is="instance.tag"
		v-if="instance.rendered"
		v-show="instance.visible"
		:class="instance.classes"
	>
	</component>
</template>

<style lang="scss">
@reference "./../../../foundation/tailwind";

.s-icon {
	&--size-normal {
		@apply w-[1em] h-[1em];
	}

	&--size-lg {
		@apply w-[1.35em] h-[1.35em];
	}

	&--size-sm {
		@apply w-[.875em] h-[.875em];
	}
}
</style>
