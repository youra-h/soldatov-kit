<script lang="ts">
import { TCheckBox, type ICheckBox } from '../../../core'
import BaseCheckBox, { syncCheckBox } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'

export default {
	name: '_CheckBox',
	extends: BaseCheckBox,
	setup(props: ICheckBox, { emit }) {
		const { is: component } = useBaseSetup(TCheckBox, props)

		syncCheckBox({
			props,
			instance: component,
			emit,
		})

		return { component }
	},
}
</script>

<template>
	<div :class="component.classes">
		{{ console.log(component.value) }}
		<input
			type="checkbox"
			:id="component.id.toString()"
			:value="component.value"
			:name="component.name"
			:disabled="component.disabled"
			:readonly="component.readonly"
			:required="component.required"
			:aria-checked="component.getAriaChecked()"
			@click="component.change($event)"
		/>
		<div class="s-check-box__container">
			<Icon v-if="component.icon" :is="component.icon" />
			<svg
				v-else
				class="s-check-box__icon"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					v-if="component.indeterminate"
					d="M5 12H19"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					v-else-if="component.value"
					d="M20 6L9 17L4 12"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
	</div>
</template>

<style lang="scss">
@reference "./../../theme";

.s-check-box {
	$this: &;

	@apply inline-flex items-center gap-2 cursor-pointer select-none;
	@apply relative;

	input {
		@apply absolute top-0 left-0 w-full h-full opacity-0 m-0 p-0;
		@apply cursor-pointer;
		@apply z-10;

		&:disabled + .s-check-box__container {
			@apply cursor-not-allowed opacity-50;
		}
	}

	.s-check-box__container {
		@apply flex items-center justify-center;
		@apply w-5 h-5 rounded-sm border border-gray-400;
		@apply bg-white;
		@apply transition-colors duration-200;
		@apply shrink-0;

		svg.s-check-box__icon {
			@apply w-3.5 h-3.5 text-transparent;
			@apply transition-colors duration-200;
		}
	}

	&.s-check-box--checked .s-check-box__container {
		@apply bg-blue-600 border-blue-600;

		svg.s-check-box__icon {
			@apply text-white;
		}
	}

	&.s-check-box--indeterminate .s-check-box__container {
		@apply bg-blue-600 border-blue-600;

		svg.s-check-box__icon {
			@apply text-white;
		}
	}

	&.s-check-box--plain .s-check-box__container {
		@apply border-gray-300 bg-gray-100;

		svg.s-check-box__icon {
			@apply text-gray-600;
		}
	}
}
</style>
