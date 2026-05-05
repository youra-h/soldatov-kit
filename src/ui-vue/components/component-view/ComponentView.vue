<script lang="ts">
import { TComponentView, type IComponentViewProps } from '@core'
import BaseComponentView, { syncComponentView } from './base.component'
import { useInstance } from '../../composables/useInstance'
import { usePlugins } from '../../composables/usePlugins'
import { TComponentViewContainer } from '@plugins'
import type { TBaseComponentViewProps } from './types'

export default {
	name: '_ComponentView',
	extends: BaseComponentView,
	setup(props: TBaseComponentViewProps<IComponentViewProps>, { emit }) {
		// Получение инстанса из пропсов или создание нового
		const { ctrl: instance, raw } = useInstance(TComponentView, props)
		// Инициализация плагинов
		const { plugins, rootRef } = usePlugins(TComponentViewContainer, props?.plugins, raw)

		syncComponentView({
			props,
			instance,
			plugins,
			emit,
		})

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
