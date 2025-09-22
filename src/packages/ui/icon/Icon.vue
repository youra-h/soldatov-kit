<script lang="ts">
import { TIcon, type IIcon } from '../../../core'
import { useBaseSetup } from '../../common/useBaseSetup'
import BaseIcon, { syncIcon } from './base.component'

export default {
	name: '_Icon',
	extends: BaseIcon,
	setup(props: IIcon) {
		const { component } = useBaseSetup(TIcon, props)

		syncIcon(props, component)

		return {
			component,
		}
	},
}
</script>

<template>
	<component
		:is="component.tag"
		v-if="component.isHidden"
		v-show="component.isVisibility"
		:class="component.classes"
	>
	</component>
</template>

<style lang="scss">
@reference "./../../theme";

.s-icon {
}
</style>
