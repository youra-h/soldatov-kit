<script lang="ts">
import type { UnwrapNestedRefs } from 'vue'
import { TComponentView, type IComponentView, type IComponentViewProps } from '@core'
import BaseComponentView, { syncComponentView } from './base.component'
import { useInstance } from '../../composables/useInstance'
import { TComponentViewContainer } from '@plugins'
import { usePlugins } from '../../composables/usePlugins'

type TComponentViewVueProps = IComponentViewProps & {
	ctrl?: IComponentView | UnwrapNestedRefs<IComponentView>
}

export default {
	name: '_ComponentView',
	extends: BaseComponentView,
	setup(props: TComponentViewVueProps, { emit }) {
		// Получение инстанса из пропсов или создание нового
		const { ctrl: instance, raw } = useInstance(TComponentView, props)
		// Инициализация плагинов
		const { plugins, rootRef } = usePlugins(TComponentViewContainer, raw)

		syncComponentView({
			props,
			instance,
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
