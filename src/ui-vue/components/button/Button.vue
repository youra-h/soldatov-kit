<script lang="ts">
import { TButton, type IButtonProps } from '../../../core'
import { useBaseSetup } from '../../composables/useBaseSetup'
import BaseButton, { syncButton } from './base.component'

export default {
	name: '_Button',
	extends: BaseButton,
	setup(props: IButtonProps, { emit }) {
		const { is: instance } = useBaseSetup(TButton, props)

		syncButton({
			props,
			instance: instance,
			emit,
		})

		return {
			instance,
		}
	},
}
</script>

<template>
	<component
		:is="instance.tag"
		v-if="instance.rendered"
		v-show="instance.visible"
		:class="instance.classes"
		:disabled="instance.disabled || undefined"
		@click="instance.events.emit('click', $event)"
	>
		<slot name="before">
			<Icon v-if="instance.icon" :is="instance.icon" />
		</slot>
		<slot>{{ instance.text }}</slot>
		<slot name="after">
			<Spinner v-if="instance.loading && instance.loadingState.spinner" :is="instance.loadingState.spinner" />
		</slot>
	</component>
</template>

<style lang="scss">
@use './mixines' as mixines;
@reference "./../../../foundation/tailwind";

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
