<script lang="ts">
import { type IFrameProps, type IFrame, TFrame } from '@core'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import BaseFrame, { syncFrame } from './base.component'
import { createFrameBundle } from '@plugins'
import type { TBaseComponentProps } from '../component'

export default {
	name: '_Frame',
	extends: BaseFrame,
	setup(props: TBaseComponentProps<IFrameProps, IFrame>, { emit }) {
		const instance = useInstance(TFrame, props)

		// Инициализация плагинов
		const plugins = useBundle(createFrameBundle, props?.plugins)

		// Привязка инстанса к плагинам
		useInstanceBinding(plugins, instance)
		// Привязка элемента к плагинам
		const rootRef = useElementBinding(plugins)

		const { visible, rendered, x, y, width, height, styles, target } = syncFrame({
			props,
			instance,
			plugins,
			emit,
		})

		return {
			instance,
			plugins,
			rootRef,
			styles,
			visible,
			rendered,
			x,
			y,
			width,
			height,
			target,
		}
	},
}
</script>

<template>
	<teleport :to="target">
		<div ref="rootRef" v-show="visible" v-if="rendered" :style="styles" class="s-frame">
			<slot />
		</div>
	</teleport>
</template>
