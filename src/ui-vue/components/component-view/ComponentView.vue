<script lang="ts">
import type { UnwrapNestedRefs } from 'vue'
import { TComponentView, type IComponentView, type IComponentViewProps } from '../../../core'
import BaseComponentView, { syncComponentView } from './base.component'
import { useBaseSetup } from '../../composables/useBaseSetup'

type TComponentViewVueProps = IComponentViewProps & {
	is?: IComponentView | UnwrapNestedRefs<IComponentView>
}

export default {
	name: '_ComponentView',
	extends: BaseComponentView,
	setup(props: TComponentViewVueProps, { emit }) {
		const { is: instance } = useBaseSetup(TComponentView, props)

		syncComponentView({
			instance,
			props,
			emit,
		})

		return { instance }
	},
}
</script>

<template>
	<component
		:is="instance.tag"
		v-if="instance.rendered"
		v-show="instance.visible"
		:class="instance.classes"
	>
		<slot />
	</component>
</template>
