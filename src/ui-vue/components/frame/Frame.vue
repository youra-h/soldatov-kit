<script lang="ts">
import { type IFrameProps, type IFrame, TFrame } from '@core'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import BaseFrame, { syncFrame } from './base.component'
import { createFrameBundle, TFrameStylePlugin } from '@plugins'
import { useEventState } from '../../composables/useEventState'
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

		const { visible, x, y, width, height, styles } = syncFrame({
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
			x,
			y,
			width,
			height,
		}
	},
}
</script>

<template>
	<div ref="rootRef" v-show="visible" :style="styles" class="s-frame">
		<slot />
	</div>
</template>

<style lang="scss">
@reference "./../../../foundation/tailwind";

.s-frame {
	// Базовые стили для Frame — минимальны, всё управляется через style
}
</style>
