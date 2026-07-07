<script lang="ts">
import { TSwitch, type ISwitchProps, type ISwitch } from '@core'
import BaseSwitch, { syncSwitch } from './base.component'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import { useSplitAttrs } from '../../composables/useSplitAttrs'
import { createInputBoolBundle } from '@plugins'
import type { TBaseComponentViewProps } from '../component-view'

export default {
	name: '_Switch',
	inheritAttrs: false,
	extends: BaseSwitch,
	setup(props: TBaseComponentViewProps<ISwitchProps, ISwitch>, { emit }) {
		const instance = useInstance(TSwitch, props)
		// Инициализация плагинов
		const plugins = useBundle(createInputBoolBundle, props?.plugins)
		// Привязка инстанса к плагинам
		useInstanceBinding(plugins, instance)
		// Привязка элемента и инстанса к плагинам
		const rootRef = useElementBinding(plugins)

		const { rendered, visible, classes, disabled, name, size, value, readonly, required } =
			syncSwitch({
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
		<input
			type="checkbox"
			:id="instance.id.toString()"
			:checked="value"
			:name="name"
			:disabled="disabled"
			:required="required"
			:aria-checked="Boolean(value)"
			v-bind="controlAttrs"
		/>
		<div class="s-switch__track">
			<div class="s-switch__track--thumb">
				<transition name="fade" mode="out-in">
					<slot v-if="!value" name="off" :value="value" :instance="instance"> </slot>
					<slot v-else name="on" :value="value" :instance="instance"> </slot>
				</transition>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@use './mixines' as mixines;
@use './../../styles/fade';
@use './../../styles/required' as required;
@reference "./../../../foundation/tailwind";

.s-switch {
	$this: &;

	@include fade.fade-transition();

	@apply relative select-none;
	@apply inline-flex items-center;

	input {
		@apply absolute top-0 left-0 opacity-0;
		@apply w-full h-full m-0 p-0;
		@apply cursor-pointer;
		@apply z-10;

		&:disabled {
			@apply cursor-default pointer-events-none;
		}

		&:disabled + #{$this}__track {
			@apply opacity-s-component-disabled;
		}

		&:focus-visible {
			+ #{$this}__track {
				@apply outline-2 outline-offset-2 outline-s-component;
			}
		}

		&:checked + #{$this}__track {
			#{$this}__track--thumb {
				@apply translate-x-4;
			}
		}
	}

	&__track {
		@apply relative;
		@apply rounded-full;
		@apply transition-colors duration-200;

		&--thumb {
			@apply relative;
			@apply flex items-center justify-center;
			@apply bg-white;
			@apply rounded-full shadow-md;
			@apply absolute top-0.5 left-0.5;
			@apply transition-transform duration-200;
		}
	}

	&--size-sm {
		@include mixines.switch-size($this, 6);
	}
	&--size-normal {
		@include mixines.switch-size($this, 8);
	}
	&--size-lg {
		@include mixines.switch-size($this, 10);
	}
	&--size-xl {
		@include mixines.switch-size($this, 12);
	}
	&--size-2xl {
		@include mixines.switch-size($this, 14);
	}

	&--normal {
		@include mixines.switch-variant($this, $color: 'neutral');
	}

	&--accent {
		@include mixines.switch-variant($this, $color: 'accent');
	}

	&--positive {
		@include mixines.switch-variant($this, $color: 'positive');
	}

	&--negative {
		@include mixines.switch-variant($this, $color: 'negative');
	}

	&--caution {
		@include mixines.switch-variant($this, $color: 'caution');
	}

	&--required {
		&::after {
			@include required.required-indicator($top: '-top-0.5', $left: '-left-0.5');
			@apply z-20;
		}
	}

	&--readonly {
		input {
			@apply pointer-events-none;
		}

		#{$this}__track {
			@apply opacity-60;
		}
	}
}
</style>
