<script lang="ts">
import { TPresentable, type IPresentableProps } from '../../../core'
import BasePresentable, { syncPresentable } from './base.component'
import { useBaseSetup } from '../../composables/useBaseSetup'

export default {
	name: '_Presentable',
	extends: BasePresentable,
	setup(props: IPresentableProps, { emit }) {
		const { is: component } = useBaseSetup(TPresentable, props)

		syncPresentable({
			instance: component,
			props,
			emit,
		})

		return { component }
	}
}
</script>

<template>
	<component
		:is="component.tag"
		v-if="component.rendered"
		v-show="component.visible"
		:class="component.classes"
	>
		<slot />
	</component>
</template>
