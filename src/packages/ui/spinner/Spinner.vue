<script lang="ts">
import { TSpinner, type ISpinner } from '../../../core'
import { useBaseSetup } from '../../common/useBaseSetup'
import BaseSpinner, { syncSpinner } from './base.component'

export default {
	name: '_Spinner',
	extends: BaseSpinner,
	setup(props: ISpinner) {
		const { component } = useBaseSetup(TSpinner, props)

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
@reference "./../../theme";

.s-spinner {
	@apply w-4 h-4;
	@apply inline-flex rounded-full animate-spin;
	@apply border-[length:var(--spinner-border-width,1px)];
	@apply border-t-sky-100 border-r-sky-100 border-b-sky-100 border-l-sky-600;
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

	&--secondary {
		@apply border-t-gray-200 border-r-gray-200 border-b-gray-200 border-l-gray-700;
	}

	&--success {
		@apply border-t-emerald-100 border-r-emerald-100 border-b-emerald-100 border-l-emerald-600;
	}

	&--danger {
		@apply border-t-rose-100 border-r-rose-100 border-b-rose-100 border-l-rose-600;
	}

	&--warning {
		@apply border-t-amber-100 border-r-amber-100 border-b-amber-100 border-l-amber-600;
	}
}
</style>
