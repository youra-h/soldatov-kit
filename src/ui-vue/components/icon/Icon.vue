<script lang="ts">
import { TIcon, type IIconProps } from '../../../core'
import { useBaseSetup } from '../../composables/useBaseSetup'
import BaseIcon, { syncIcon } from './base.component'

export default {
	name: '_Icon',
	extends: BaseIcon,
	setup(props: IIconProps, { emit }) {
		const { is: component } = useBaseSetup(TIcon, props)

		syncIcon({
			props,
			instance: component,
			emit,
		})

		return {
			component,
		}
	},
}
</script>

<template>
	<component
		:is="component.tag"
		v-if="component.rendered"
		v-show="component.visible"
		:class="component.classes"
	>
	</component>
</template>

<style lang="scss">
@reference "./../../theme";

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
