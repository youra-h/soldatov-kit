<script lang="ts">
import { TSpinner, type ISpinnerProps, type ISpinner } from '@core'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import BaseSpinner, { syncSpinner } from './base.component'
import { createComponentViewBundle, TSpinnerStylePlugin } from '@plugins'
import type { TBaseComponentViewProps } from '../component-view'

export default {
	name: '_Spinner',
	extends: BaseSpinner,
	setup(props: TBaseComponentViewProps<ISpinnerProps, ISpinner>, { emit }) {
		const instance = useInstance(TSpinner, props)
		// Инициализация плагинов
		const plugins = useBundle(createComponentViewBundle, props?.plugins).use(
			TSpinnerStylePlugin,
		)

		// Привязка инстанса к плагинам
		useInstanceBinding(plugins, instance)
		// Привязка элемента и инстанса к плагинам
		const rootRef = useElementBinding(plugins)

		const { tag, rendered, visible, classes, size, variant, borderWidth, styles } =
			syncSpinner({
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
			size,
			variant,
			borderWidth,
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
		<slot />
	</component>
</template>

<style lang="scss">
@use './mixines' as mixines;
@reference "./../../../foundation/tailwind";

.s-spinner {
	@apply w-4 h-4;
	@apply inline-flex rounded-full animate-spin;
	@apply border-[length:var(--spinner-border-width,1px)];
	@apply opacity-100;
	animation-duration: 1.1s;
	animation-iteration-count: infinite;
	animation-timing-function: cubic-bezier(0.53, 0.21, 0.29, 0.67);
	transition: opacity 170ms cubic-bezier(0.53, 0.21, 0.29, 0.67);

	&--size-sm {
		@apply w-3 h-3;
	}

	&--size-lg {
		@apply w-5 h-5;
	}

	&--size-xl {
		@apply w-6 h-6;
	}

	&--size-2xl {
		@apply w-7 h-7;
	}

	&--normal {
		@include mixines.spinner-variant('neutral');
	}

	&--accent {
		@include mixines.spinner-variant('accent');
	}

	&--positive {
		@include mixines.spinner-variant('positive');
	}

	&--negative {
		@include mixines.spinner-variant('negative');
	}

	&--caution {
		@include mixines.spinner-variant('caution');
	}
}
</style>
