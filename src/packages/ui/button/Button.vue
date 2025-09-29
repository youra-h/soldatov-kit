<script lang="ts">
import { TButton, type IButton } from '../../../core'
import { useBaseSetup } from '../../common/useBaseSetup'
import BaseButton, { syncButton } from './base.component'

export default {
	name: '_Button',
	extends: BaseButton,
	setup(props: IButton, { emit }) {
		const { is: component } = useBaseSetup(TButton, props)

		syncButton({
			props,
			instance: component,
			emit,
		})

		return {
			component
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
		:disabled="component.disabled || undefined"
		@click="component.emit('click', $event)"
	>
		<slot name="before">
			<Icon v-if="component.icon" :is="component.icon" />
		</slot>
		<slot>{{ component.text }}</slot>
		<slot name="after">
			<Spinner v-if="component.loading" :is="component.spinner" />
		</slot>
	</component>
</template>

<style lang="scss">
@use './mixines' as mixines;
@reference "./../../theme";

.s-button {
	$this: &;

	@apply flex items-center justify-center gap-1.5;
	@apply px-2.5 py-1 rounded-md cursor-pointer;
	@apply relative transition-colors duration-200;
	@apply truncate;
	@apply outline-transparent;
	@apply text-gray-800;

	&[disabled] {
		@apply opacity-50 cursor-not-allowed;
	}

	&:focus,
	&:focus-visible {
		@apply duration-100;
		@apply outline-2 outline-offset-2 outline-blue-400;
		@apply bg-gray-200;
	}

	&:hover:not([disabled]) {
		@apply bg-gray-200;
	}

	svg {
		fill: currentColor;
	}

	&--size-sm {
		@apply text-sm;
		@apply px-1.5 py-0.5;
		@apply gap-1;
	}

	&--size-lg {
		@apply text-lg;
		@apply px-3.5 py-1.5;
		@apply gap-2;
	}

	&--normal {
		@apply bg-gray-100;
		@apply dark:bg-gray-900;

		&:active:not([disabled]) {
			@apply bg-gray-300;
		}

		&.s-button--primary,
		&.s-button--secondary,
		&.s-button--success,
		&.s-button--danger,
		&.s-button--warning {
			@apply text-white;
		}

		&.s-button--primary {
			@include mixines.button-variant($color: 'sky', $bg-idx: 600);
		}

		&.s-button--secondary {
			@include mixines.button-variant($color: 'gray', $bg-idx: 700);
		}

		&.s-button--success {
			@include mixines.button-variant($color: 'emerald', $bg-idx: 600);
		}

		&.s-button--danger {
			@include mixines.button-variant($color: 'rose', $bg-idx: 600);
		}

		&.s-button--warning {
			@include mixines.button-variant($color: 'amber', $bg-idx: 600);
		}
	}

	&--plain {
		@apply bg-transparent;

		@include mixines.button-variant($color: 'gray', $hover-bg-idx: 100, $text-idx: 700);

		&.s-button--primary {
			@include mixines.button-variant(
				$color: 'sky',
				$hover-bg-idx: 50,
				$text-idx: 700,
				$active-bg-idx: 100
			);
		}

		&.s-button--success {
			@include mixines.button-variant(
				$color: 'emerald',
				$hover-bg-idx: 50,
				$text-idx: 700,
				$active-bg-idx: 100
			);
		}

		&.s-button--danger {
			@include mixines.button-variant(
				$color: 'rose',
				$hover-bg-idx: 50,
				$text-idx: 700,
				$active-bg-idx: 100
			);
		}

		&.s-button--warning {
			@include mixines.button-variant(
				$color: 'amber',
				$hover-bg-idx: 50,
				$text-idx: 700,
				$active-bg-idx: 100
			);
		}
	}

	&--outlined {
		@apply bg-transparent border;

		@include mixines.button-variant(
			$color: 'gray',
			$hover-bg-idx: 100,
			$text-idx: 700,
			$border-idx: 200
		);

		&.s-button--primary {
			@include mixines.button-variant(
				$color: 'sky',
				$hover-bg-idx: 50,
				$text-idx: 600,
				$active-bg-idx: 100,
				$border-idx: 200
			);
		}

		&.s-button--success {
			@include mixines.button-variant(
				$color: 'emerald',
				$hover-bg-idx: 50,
				$text-idx: 600,
				$active-bg-idx: 100,
				$border-idx: 200
			);
		}

		&.s-button--danger {
			@include mixines.button-variant(
				$color: 'rose',
				$hover-bg-idx: 50,
				$text-idx: 600,
				$active-bg-idx: 100,
				$border-idx: 200
			);
		}

		&.s-button--warning {
			@include mixines.button-variant(
				$color: 'amber',
				$hover-bg-idx: 50,
				$text-idx: 600,
				$active-bg-idx: 100,
				$border-idx: 200
			);
		}
	}
}
</style>
