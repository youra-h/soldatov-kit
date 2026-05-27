<script lang="ts">
import { TComponentView, type IComponentViewProps } from '@core'
import BaseComponentView, { syncComponentView } from './base.component'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import { createComponentViewBundle } from '@plugins'
import type { TBaseComponentViewProps } from './types'

export default {
	name: '_ComponentView',
	extends: BaseComponentView,
	setup(props: TBaseComponentViewProps<IComponentViewProps>, { emit }) {
		const instance = useInstance(TComponentView, props)
		// Инициализация плагинов
		const plugins = useBundle(createComponentViewBundle, props?.plugins)
		// Привязка инстанса к плагинам
		useInstanceBinding(plugins, instance)
		// Привязка элемента и инстанса к плагинам
		const rootRef = useElementBinding(plugins)

		const { tag, rendered, visible, classes } = syncComponentView({
			props,
			instance,
			plugins,
			emit,
		})

		return { instance, plugins, rootRef, tag, rendered, visible, classes }
	},
}
</script>

<template>
	<component ref="rootRef" :is="tag" v-if="rendered" v-show="visible" :class="classes">
		<slot />
	</component>
</template>
