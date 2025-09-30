<script lang="ts">
import { TCheckBox, type ICheckBox } from '../../../core'
import BaseCheckBox, { syncCheckBox } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'
import { Icon, useIconImport } from '../icon'
import { TIcon } from '../../../core'

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

		if (!component.icon) {
			component.icon = TIcon.create({
				tag: useIconImport('/src/packages/icons/check.svg'),
			})
		}

		if (!component.indeterminateIcon) {
			component.indeterminateIcon = TIcon.create({
				tag: useIconImport('/src/packages/icons/check_indeterminate.svg'),
			})
		}

		return { component }
	},
}
</script>

<template>
	<div :class="component.classes">
		<input
			type="checkbox"
			:id="component.id.toString()"
			:checked="component.value || undefined"
			:name="component.name"
			:disabled="component.disabled"
			:readonly="component.readonly"
			:required="component.required"
			:aria-checked="component.getAriaChecked()"
			@change="component.change($event)"
		/>
		<div class="s-check-box__container">
			<slot name="icon" :value="component.value" :indeterminate="component.indeterminate">
				<Icon v-if="component.icon && component.value" :is="component.icon" />
				<Icon
					v-else-if="
						component.indeterminate && component.indeterminateIcon && !!!component.value
					"
					:is="component.indeterminateIcon"
				/>
			</slot>
		</div>
	</div>
</template>

<style lang="scss">
@use './mixines' as mixines;
@reference "./../../theme";

.s-check-box {
	$this: &;

	@apply w-5 h-5;
	@apply relative select-none;

	input {
		@apply absolute inset-0 opacity-0;
		@apply w-full h-full m-0 p-0;
		@apply cursor-pointer;
		@apply z-10;

		&:disabled {
			@apply cursor-default pointer-events-none;
		}

		&:disabled + #{$this}__container {
			@apply border-gray-200 bg-gray-50;

			svg {
				@apply opacity-50;
			}
		}

		&:focus + #{$this}__container {
			@apply outline-2 outline-offset-2 outline-blue-400;
		}

		&:hover:not(:disabled) + #{$this}__container {
			@apply border-gray-500;
		}
	}

	&__container {
		@apply flex items-center justify-center;
		@apply w-full h-full rounded-md border border-gray-400;
		@apply bg-white;
		@apply transition-colors duration-150;

		svg {
			@apply fill-gray-700;
		}
	}

	&--plain {
		input {
			&:focus + #{$this}__container {
				@apply outline-0;
			}
		}

		#{$this}__container {
			@apply border-0;
		}
	}

	&--size-sm {
		@apply w-4 h-4;
	}

	&--size-lg {
		@apply w-6 h-6;
	}

	&--size-xl {
		@apply w-7 h-7;
	}

	&--size-2xl {
		@apply w-8 h-8;
	}

	&--secondary {
		input {
			&:checked + #{$this}__container {
				@apply bg-gray-700 border-gray-700;

				svg {
					@apply fill-white;
				}
			}

			&:disabled + #{$this}__container {
				@apply border-gray-400 bg-gray-400;
			}
		}
	}

	&--primary {
		@include mixines.checkbox-variant($this, $color: 'sky');
	}

	&--success {
		@include mixines.checkbox-variant($this, $color: 'emerald');
	}

	&--danger {
		@include mixines.checkbox-variant($this, $color: 'rose');
	}

	&--warning {
		@include mixines.checkbox-variant($this, $color: 'amber');
	}
}
</style>
