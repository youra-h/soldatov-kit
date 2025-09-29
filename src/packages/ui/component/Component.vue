<script lang="ts">
import { TComponent, type IComponent } from '../../../core'
import BaseComponent, { syncComponent } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'

export default {
	name: '_Component',
	extends: BaseComponent,
	setup(props: IComponent, { emit }) {
		const { is: component } = useBaseSetup(TComponent, props)

		syncComponent({
			instance: component,
			props,
			emit,
		})

		return { component }
	},
	created() {
		console.log('Component created', this.component)
		this.$emit('created', this.component)
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
		<slot />
	</component>
</template>
