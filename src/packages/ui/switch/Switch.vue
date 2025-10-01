<script lang="ts">
import { TSwitch, type ISwitch } from '../../../core'
import BaseSwitch, { syncSwitch } from './base.component'
import { useBaseSetup } from '../../common/useBaseSetup'
import { Icon, useIconImport } from '../icon'
import { TIcon } from '../../../core'

export default {
	name: '_Switch',
	extends: BaseSwitch,
	setup(props: ISwitch, { emit }) {
		const { is: component } = useBaseSetup(TSwitch, props)

		syncSwitch({
			props,
			instance: component,
			emit,
		})

		if (!component.icon) {
			component.icon = TIcon.create({
				tag: useIconImport('/src/packages/icons/check.svg'),
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
			:aria-checked="component.value"
			@change="component.change($event)"
		/>
		<div class="s-switch__track">
			<div class="s-switch__track--thumb">
				<Spinner v-if="component.loading" :is="component.spinner" />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@use './mixines' as mixines;
@reference "./../../theme";

.s-switch {
	$this: &;

	@apply relative select-none;
	@apply inline-flex items-center;

	input {
		@apply absolute top-0 left-0 opacity-0;
		@apply w-full h-full m-0 p-0;
		@apply cursor-pointer;
		@apply z-10;

		&:disabled {
			@apply cursor-not-allowed pointer-events-none;
		}

		&:disabled + #{$this}__track {
			@apply opacity-50;
		}

		&:focus,
		&:focus-visible {
			+ #{$this}__track {
				@apply outline-2 outline-offset-2 outline-blue-400;
			}
		}

		&:checked + #{$this}__track {
			@apply bg-gray-700;

			#{$this}__track--thumb {
				@apply translate-x-4;
			}
		}

		&:hover:not(:disabled):not(:checked) + #{$this}__track {
			@apply bg-gray-300;
		}
	}

	&__track {
		@apply w-10 h-6;
		@apply relative;
		@apply bg-gray-200;
		@apply rounded-full;
		@apply transition-colors duration-200;

		&--thumb {
			@apply w-5 h-5;
			@apply flex items-center justify-center;
			@apply bg-white;
			@apply rounded-full shadow-md;
			@apply absolute top-0.5 left-0.5;
			@apply transition-transform duration-200;
		}
	}

	&--size-sm {
		@include mixines.switch-size($this, 8, 5, 4, 3);
	}
	&--size-lg {
		@include mixines.switch-size($this, 12, 7, 6, 5);
	}
	&--size-xl {
		@include mixines.switch-size($this, 14, 8, 7, 6);
	}
	&--size-2xl {
		@include mixines.switch-size($this, 16, 9, 8, 7);
	}

	&--primary {
		@include mixines.switch-variant(
			$this,
			$color: 'sky',
			$bg-checked: 600,
			$bg-hover: 200,
			$bg-track: 100
		);
	}

	&--secondary {
	}

	&--success {
		@include mixines.switch-variant(
			$this,
			$color: 'emerald',
			$bg-checked: 600,
			$bg-hover: 200,
			$bg-track: 100
		);
	}

	&--danger {
		@include mixines.switch-variant(
			$this,
			$color: 'rose',
			$bg-checked: 600,
			$bg-hover: 200,
			$bg-track: 100
		);
	}

	&--warning {
		@include mixines.switch-variant(
			$this,
			$color: 'amber',
			$bg-checked: 600,
			$bg-hover: 200,
			$bg-track: 100
		);
	}
}
</style>
