<script lang="ts">
import { TSpinner, type ISpinnerProps } from '@core'
import { useBaseSetup } from '../../composables/useBaseSetup'
import { useElementSync } from '../../composables/useElementSync'
import BaseSpinner, { syncSpinner } from './base.component'

export default {
	name: '_Spinner',
	extends: BaseSpinner,
	setup(props: ISpinnerProps, { emit }) {
		const { is: instance } = useBaseSetup(TSpinner, props)

		syncSpinner({
			props,
			instance,
			emit,
		})

		const rootRef = useElementSync(instance)

		return {
			instance,
			rootRef,
		}
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
		:style="instance.styles"
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

	@include mixines.spinner-variant(neutral, 200, 700);

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

	&--accent {
		@include mixines.spinner-variant(accent, 100, 600);
	}

	&--neutral {
		@include mixines.spinner-variant(neutral, 200, 700);
	}

	&--positive {
		@include mixines.spinner-variant(positive, 100, 600);
	}

	&--negative {
		@include mixines.spinner-variant(negative, 100, 600);
	}

	&--caution {
		@include mixines.spinner-variant(caution, 100, 600);
	}
}
</style>
