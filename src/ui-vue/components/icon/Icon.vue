<script lang="ts">
import { TIcon, type IIconProps } from '@core'
import { useBaseSetup } from '../../composables/useBaseSetup'
import { useElementSync } from '../../composables/useElementSync'
import BaseIcon, { syncIcon } from './base.component'

export default {
	name: '_Icon',
	extends: BaseIcon,
	setup(props: IIconProps, { emit }) {
		const { ctrl: instance } = useBaseSetup(TIcon, props)

		syncIcon({
			props,
			instance,
			emit,
		})

		const rootRef = useElementSync(instance)

		return {
			instance,
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
