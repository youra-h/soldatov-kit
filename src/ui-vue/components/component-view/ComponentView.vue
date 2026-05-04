<script lang="ts">
import type { UnwrapNestedRefs } from 'vue'
import { TComponentView, type IComponentView, type IComponentViewProps } from '@core'
import BaseComponentView, { syncComponentView } from './base.component'
import { useBaseSetup } from '../../composables/useBaseSetup'
import { TComponentViewContainer } from '@plugins'
import { usePlugins } from '../../composables/usePlugins'

type TComponentViewVueProps = IComponentViewProps & {
	ctrl?: IComponentView | UnwrapNestedRefs<IComponentView>
}

export default {
	name: '_ComponentView',
	extends: BaseComponentView,
	setup(props: TComponentViewVueProps, { emit }) {
		const { ctrl: instance, raw } = useBaseSetup(TComponentView, props)

		syncComponentView({
			props,
			instance,
			emit,
		})

		const { plugins, rootRef } = usePlugins(TComponentViewContainer, raw)

		return { instance, plugins, rootRef }
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
