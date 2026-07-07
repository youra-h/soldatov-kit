<script lang="ts">
import { TButton, type IButton, type IButtonProps } from '@core'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import BaseButton, { syncButton } from './base.component'
import { createComponentViewBundle } from '@plugins'
import type { TBaseComponentViewProps } from '../component-view'

export default {
	name: '_Button',
	extends: BaseButton,
	setup(props: TBaseComponentViewProps<IButtonProps, IButton>, { emit }) {
		const instance = useInstance(TButton, props)

		const plugins = useBundle(createComponentViewBundle, props?.plugins)

		useInstanceBinding(plugins, instance)

		const rootRef = useElementBinding(plugins)

		const { tag, rendered, visible, classes, disabled, text } = syncButton({
			props,
			instance,
			plugins,
			emit,
		})

		return {
			instance,
			plugins,
			rootRef,
			tag,
			rendered,
			visible,
			disabled,
			classes,
			text,
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
		:disabled="tag === 'button' ? disabled : undefined"
		:aria-disabled="tag !== 'button' ? disabled : undefined"
	>
		<slot name="leading"> </slot>
		<span class="s-button__text">
			<slot :text="text">{{ text }}</slot>
		</span>
		<slot name="trailing"> </slot>
	</component>
</template>

<style lang="scss">
@use './mixines' as mixines;
@reference "./../../../foundation/tailwind";

.s-button {
	$this: &;

	@apply flex items-center justify-center;
	@apply rounded-md cursor-pointer;
	@apply relative transition-colors duration-200;
	@apply outline-transparent;
	@apply text-s-component;
	@apply max-h-full;

	&__text {
		@apply grow truncate text-center;
	}

	&[disabled],
	&[aria-disabled='true'] {
		@apply opacity-s-component-disabled cursor-default pointer-events-none;
	}

	&:focus-visible {
		&:not(#{$this}--a-none) {
			@apply duration-100;
			@apply outline-2 outline-offset-2 outline-s-component;
		}
	}

	svg {
		fill: currentColor;
	}

	&--size-sm {
		@apply text-sm;
		@apply px-1.5 h-7;
		@apply gap-1;
	}

	&--size-normal {
		@apply px-2.5 h-8;
		@apply gap-1.5;
	}

	&--size-lg {
		@apply text-lg;
		@apply px-3 h-9;
		@apply gap-2;
	}

	&--size-xl {
		@apply text-xl;
		@apply px-3.5 h-10;
		@apply gap-2.5;
	}

	&--size-2xl {
		@apply text-2xl;
		@apply px-4 h-11;
		@apply gap-3;
	}

	&--a-filled {
		@include mixines.button-variant-filled('neutral', 100);

		&.s-button--accent,
		&.s-button--positive,
		&.s-button--negative,
		&.s-button--caution {
			@apply text-white;
		}

		&.s-button--accent {
			@include mixines.button-variant-filled('accent');
		}

		&.s-button--positive {
			@include mixines.button-variant-filled('positive');
		}

		&.s-button--negative {
			@include mixines.button-variant-filled('negative');
		}

		&.s-button--caution {
			@include mixines.button-variant-filled('caution');
		}
	}

	&--a-none {
		@apply bg-transparent;
	}

	&--a-plain {
		@apply bg-transparent;

		@include mixines.button-variant-plain('neutral');

		&.s-button--accent {
			@include mixines.button-variant-plain('accent');
		}

		&.s-button--positive {
			@include mixines.button-variant-plain('positive');
		}

		&.s-button--negative {
			@include mixines.button-variant-plain('negative');
		}

		&.s-button--caution {
			@include mixines.button-variant-plain('caution');
		}
	}

	&--a-outlined {
		@apply bg-transparent border;

		@include mixines.button-variant-outlined('neutral');

		&.s-button--accent {
			@include mixines.button-variant-outlined('accent');
		}

		&.s-button--positive {
			@include mixines.button-variant-outlined('positive');
		}

		&.s-button--negative {
			@include mixines.button-variant-outlined('negative');
		}

		&.s-button--caution {
			@include mixines.button-variant-outlined('caution');
		}
	}
}
</style>
