<script lang="ts">
import { TInput, type IInputProps, type IInput } from '@core'
import BaseInput, { syncInput } from './base.component'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import { useSplitAttrs } from '../../composables/useSplitAttrs'
import { createInputBundle } from '@plugins'
import type { TBaseComponentViewProps } from '../component-view'

export default {
	name: '_Input',
	inheritAttrs: false,
	extends: BaseInput,
	setup(props: TBaseComponentViewProps<IInputProps, IInput>, { emit }) {
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

		const { containerAttrs, controlAttrs } = useSplitAttrs()

		return {
			containerAttrs,
			controlAttrs,
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
		}
	},
}
</script>

<template>
	<div ref="rootRef" v-if="rendered" v-show="visible" :class="classes" v-bind="containerAttrs">
		<slot name="leading"> </slot>
		<input
			type="text"
			:id="instance.id.toString()"
			:value="value"
			:name="name"
			:disabled="disabled"
			:readonly="readonly"
			:required="required"
			v-bind="controlAttrs"
		/>
		<slot name="trailing"> </slot>
	</div>
</template>

<style lang="scss">
@use './mixines' as mixines;
@use './../../styles/required' as required;
@reference "./../../../foundation/tailwind";

.s-input {
	$this: &;
	@apply inline-flex items-center;
	@apply relative;

	input {
		@apply w-full;
		@apply rounded-md border;
		@apply bg-white;
		@apply text-s-component;
		@apply transition-colors duration-150;
		@apply outline-none;

		&::placeholder {
			@apply text-s-component-placeholder;
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

	&--normal {
		@include mixines.input-variant('neutral');
	}

	&--accent {
		@include mixines.input-variant('accent');
	}

	&--positive {
		@include mixines.input-variant('positive');
	}

	&--negative {
		@include mixines.input-variant('negative');
	}

	&--caution {
		@include mixines.input-variant('caution');
	}

	&--size-sm {
		input {
			@apply text-sm;
			@apply px-1.5 py-0.5;
		}
		@apply gap-1;
	}

	&--size-normal {
		input {
			@apply px-2.5 py-1;
		}
		@apply gap-1.5;
	}

	&--size-lg {
		input {
			@apply px-3.5 py-1.5;
			@apply text-lg;
		}
		@apply gap-2;
	}

	&--size-xl {
		input {
			@apply px-4 py-2;
			@apply text-xl;
		}
		@apply gap-3;
	}

	&--size-2xl {
		input {
			@apply px-5 py-3;
			@apply text-2xl;
		}
		@apply gap-4;
	}
}
</style>
