<script lang="ts">
import { TComponent, type IComponent } from '../../../core'
import BaseComponent from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'

export default {
	name: '_Component',
	extends: BaseComponent,
	setup(props: IComponent) {
		const { is: component } = useBaseSetup(TComponent, props)

		return { component }
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
