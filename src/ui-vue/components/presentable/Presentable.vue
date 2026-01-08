<script lang="ts">
import { TComponentView, type IComponentView, type IComponentViewProps } from '../../../core'
import BaseComponentView, { syncComponentView } from './base.component'
import { useBaseSetup } from '../../composables/useBaseSetup'

type TComponentViewVueProps = IComponentViewProps & { is?: IComponentView }

export default {
	name: '_ComponentView',
	extends: BaseComponentView,
	setup(props: TComponentViewVueProps, { emit }) {
		const { is: component } = useBaseSetup(TComponentView, props)

		syncComponentView({
			instance: component,
			props,
			emit,
		})

		return { component }
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
		<slot />
	</component>
</template>
