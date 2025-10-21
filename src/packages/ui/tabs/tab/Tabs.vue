<script lang="ts">
import { TTabItem, type ITabItem } from '../../../core'
import { useBaseSetup } from '../../common/useBaseSetup'
import BaseTabItem, { syncTabItem } from './base.component'

export default {
	name: '_TabItem',
	extends: BaseTabItem,
	setup(props: ITabItem, { emit }) {
		const { is: component } = useBaseSetup(TTabItem, props)

		syncTabItem({
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
	>
		<slot />
	</component>
</template>

<style lang="scss">
@reference "./../../theme";

.s-tabs {

}
</style>
