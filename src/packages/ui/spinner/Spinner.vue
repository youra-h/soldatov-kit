<script lang="ts">
import { TSpinner, type ISpinner } from '../../../core'
import { useBaseSetup } from '../../common/useBaseSetup'
import BaseSpinner, { syncSpinner } from './base.component'

export default {
	name: '_Spinner',
	extends: BaseSpinner,
	setup(props: ISpinner) {
		const { is: component } = useBaseSetup(TSpinner, props)

		syncSpinner(props, component)

		return {
			component,
		}
	},
}
</script>

<template>
	<component
		:is="component.tag"
		v-if="component.isHidden"
		v-show="component.isVisibility"
		:class="component.classes"
		:style="component.styles"
	>
		<slot />
	</component>
</template>

<style lang="scss">
@use './mixines' as mixines;
@reference "./../../theme";

.s-spinner {
	@apply w-4 h-4;
	@apply inline-flex rounded-full animate-spin;
	@apply border-[length:var(--spinner-border-width,1px)];
	@apply opacity-100;
	animation-duration: 1.1s;
	animation-iteration-count: infinite;
	animation-timing-function: cubic-bezier(0.53, 0.21, 0.29, 0.67);
	transition: opacity 170ms cubic-bezier(0.53, 0.21, 0.29, 0.67);

	@include mixines.spinner-variant(gray, 200, 700);

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

	&--primary {
		@include mixines.spinner-variant(sky, 100, 600);
	}

	&--secondary {
		@include mixines.spinner-variant(gray, 200, 700);
	}

	&--success {
		@include mixines.spinner-variant(emerald, 100, 600);
	}

	&--danger {
		@include mixines.spinner-variant(rose, 100, 600);
	}

	&--warning {
		@include mixines.spinner-variant(amber, 100, 600);
	}
}
</style>
