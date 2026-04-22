<script lang="ts">
import { TButton, type IButtonProps } from '@core'
import { useBaseSetup } from '../../composables/useBaseSetup'
import { useElementSync } from '../../composables/useElementSync'
import BaseButton, { syncButton } from './base.component'

export default {
	name: '_Button',
	extends: BaseButton,
	setup(props: IButtonProps, { emit }) {
		const { is: instance } = useBaseSetup(TButton, props)

		syncButton({
			props,
			instance,
			emit,
		})

		const rootRef = useElementSync(instance)

		return {
			instance,
			rootRef,
		}
	},
}
</script>

<template>
	<component
		ref="rootRef"
		:is="instance.tag"
		v-if="instance.rendered"
		v-show="instance.visible"
		:class="instance.classes"
		:disabled="instance.disabled || undefined"
		@click="instance.events.emit('click', $event)"
	>
		<slot name="before"> </slot>
		<slot>{{ instance.text }}</slot>
		<slot name="after" :loading="instance.loading"> </slot>
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
	@apply text-s-component;

	&[disabled] {
		@apply opacity-s-component-disabled cursor-default;
	}

	&:focus,
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
		@apply px-1.5 py-0.5;
		@apply gap-1;
	}

	&--size-lg {
		@apply text-lg;
		@apply px-3.5 py-1.5;
		@apply gap-2;
	}

	&--size-xl {
		@apply text-xl;
		@apply px-4 py-2;
		@apply gap-3;
	}

	&--size-2xl {
		@apply text-2xl;
		@apply px-5 py-3;
		@apply gap-4;
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

		@include mixines.button-variant-plain('neutral', 700, 100);

		&.s-button--accent {
			@include mixines.button-variant-plain('accent', 700, 50, 100);
		}

		&.s-button--positive {
			@include mixines.button-variant-plain('positive', 700, 50, 100);
		}

		&.s-button--negative {
			@include mixines.button-variant-plain('negative', 700, 50, 100);
		}

		&.s-button--caution {
			@include mixines.button-variant-plain('caution', 700, 50, 100);
		}
	}

	&--a-outlined {
		@apply bg-transparent border;

		@include mixines.button-variant-outlined('neutral', 700, 200, 100);

		&.s-button--accent {
			@include mixines.button-variant-outlined('accent', 600, 200, 50, 100);
		}

		&.s-button--positive {
			@include mixines.button-variant-outlined('positive', 600, 200, 50, 100);
		}

		&.s-button--negative {
			@include mixines.button-variant-outlined('negative', 600, 200, 50, 100);
		}

		&.s-button--caution {
			@include mixines.button-variant-outlined('caution', 600, 200, 50, 100);
		}
	}
}
</style>
