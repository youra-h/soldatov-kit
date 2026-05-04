<script lang="ts">
import type { UnwrapNestedRefs } from 'vue'
import { TComponentView, type IComponentView, type IComponentViewProps } from '@core'
import BaseComponentView, { syncComponentView } from './base.component'
import { useBaseSetup } from '../../composables/useBaseSetup'
import { TComponentViewContainer } from '@plugins'
import { usePluginContainer } from '../../composables/usePluginContainer'

type TComponentViewVueProps = IComponentViewProps & {
	is?: IComponentView | UnwrapNestedRefs<IComponentView>
}

export default {
	name: '_ComponentView',
	extends: BaseComponentView,
	setup(props: TComponentViewVueProps, { emit }) {
		const { is: instance } = useBaseSetup(TComponentView, props)

		syncComponentView({
			props,
			instance,
			emit,
		})

		const plugins = new TComponentViewContainer()
		const rootRef = usePluginContainer(plugins, instance)

		return { instance, rootRef }
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
		<slot />
	</component>
</template>
