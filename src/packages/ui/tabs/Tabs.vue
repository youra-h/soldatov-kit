<script lang="ts">
import { TTabs, type ITabs } from '../../../core'
import { useBaseSetup } from '../../common/useBaseSetup'
import BaseTabs, { syncTabs } from './base.component'

export default {
	name: '_Tabs',
	extends: BaseTabs,
	setup(props: ITabs, { emit }) {
		const { is: component } = useBaseSetup(TTabs, props)

		syncTabs({
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
