<script lang="ts">
import { TIcon, type IIconProps, type IIcon } from '@core'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import BaseIcon, { syncIcon } from './base.component'
import { useEventState } from '../../composables/useEventState'
import { createComponentViewBundle, TIconStylePlugin } from '@plugins'
import type { TBaseComponentViewProps } from '../component-view'

export default {
	name: '_Icon',
	extends: BaseIcon,
	setup(props: TBaseComponentViewProps<IIconProps, IIcon>, { emit }) {
		const instance = useInstance(TIcon, props)
		// Инициализация плагинов
		const plugins = useBundle(createComponentViewBundle, props?.plugins).use(TIconStylePlugin)

		// Привязка инстанса к плагинам
		useInstanceBinding(plugins, instance)
		// Привязка элемента и инстанса к плагинам
		const rootRef = useElementBinding(plugins)

		const { tag, rendered, visible, classes, styles } = syncIcon({
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
			tag,
			rendered,
			visible,
			classes,
		}
	},
}
</script>

<template>
	<component
		ref="rootRef"
		:is="tag"
		v-if="rendered"
		v-show="visible"
		:class="classes"
		:style="styles"
	>
	</component>
</template>

<style lang="scss">
@reference "./../../../foundation/tailwind";

.s-icon {
	&--size-normal {
		@apply w-[1em] h-[1em];
	}

	&--size-lg {
		@apply w-[1.35em] h-[1.35em];
	}

	&--size-sm {
		@apply w-[.875em] h-[.875em];
	}
}
</style>
