<script lang="ts">
import { TInput, type IInputProps, type IInput } from '@core'
import BaseInput, { syncInput } from './base.component'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import { createInputBundle } from '@plugins'
import type { TBaseComponentViewProps } from '../component-view'

export default {
	name: '_Input',
	inheritAttrs: false,
	extends: BaseInput,
	setup(props: TBaseComponentViewProps<IInputProps, IInput>, { emit, attrs }) {
		const instance = useInstance(TInput, props)

		const plugins = useBundle(createInputBundle, props?.plugins)
		useInstanceBinding(plugins, instance)

		const rootRef = useElementBinding(plugins)

		const { rendered, visible, classes, disabled, name, size, value, readonly, required } =
			syncInput({
				props,
				instance,
				plugins,
				emit,
			})

		return {
			instance,
			plugins,
			rootRef,
			rendered,
			visible,
			classes,
			disabled,
			name,
			size,
			value,
			readonly,
			required,
			attrs,
		}
	},
}
</script>

<template>
	<div ref="rootRef" v-if="rendered" v-show="visible" :class="classes">
		<slot name="leading"> </slot>
		<input
			type="text"
			:id="instance.id.toString()"
			:value="value"
			:name="name"
			:disabled="disabled"
			:readonly="readonly"
			:required="required"
			v-bind="attrs"
		/>
		<slot name="trailing"> </slot>
	</div>
</template>

<style lang="scss">
@use './../../styles/required' as required;
@reference "./../../../foundation/tailwind";

.s-input {
	$this: &;
	@apply inline-flex items-center gap-1.5;

	input {
		@apply w-full px-3 py-1.5;
		@apply rounded-md border;
		@apply bg-white;
		@apply text-s-component;
		@apply transition-colors duration-150;
		@apply outline-none;

		&::placeholder {
			// @apply text-s-component-placeholder;
		}

		&:focus-visible {
			&:not(:disabled) {
				@apply outline-2 outline-offset-2 outline-s-component;
			}
		}

		&:disabled {
			@apply opacity-s-component-disabled;
			@apply cursor-default;
		}
	}

	&--required {
		&#{$this}::after {
			@include required.required-indicator();
		}
	}

	&--normal input {
		@apply border-s-neutral-400;

		&:hover:not(:disabled) {
			@apply border-s-neutral-500;
		}
	}

	&--accent input {
		@apply border-s-accent-400;

		&:hover:not(:disabled) {
			@apply border-s-accent-500;
		}
	}

	&--positive input {
		@apply border-s-positive-400;

		&:hover:not(:disabled) {
			@apply border-s-positive-500;
		}
	}

	&--negative input {
		@apply border-s-negative-400;

		&:hover:not(:disabled) {
			@apply border-s-negative-500;
		}
	}

	&--caution input {
		@apply border-s-caution-400;

		&:hover:not(:disabled) {
			@apply border-s-caution-500;
		}
	}

	&--size-sm input {
		@apply px-2 py-1;
		@apply text-xs;
	}

	&--size-lg input {
		@apply px-4 py-2;
	}

	&--size-xl input {
		@apply px-5 py-2.5;
	}

	&--size-2xl input {
		@apply px-6 py-3;
	}
}
</style>
