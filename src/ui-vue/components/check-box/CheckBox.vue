<script lang="ts">
import { TCheckBox, type ICheckBoxProps } from '@core'
import BaseCheckBox, { syncCheckBox } from './base.component'
import { useBaseSetup } from '../../composables/useBaseSetup'
import { useElementSync } from '../../composables/useElementSync'
import { Icon, useIconImport } from '../icon'

export default {
	name: '_CheckBox',
	extends: BaseCheckBox,
	setup(props: ICheckBoxProps, { emit }) {
		const { is: instance } = useBaseSetup(TCheckBox, props)

		syncCheckBox({
			props,
			instance,
			emit,
		})

		// Иконки по умолчанию
		const defaultIconTag = useIconImport('../../icons/check.svg')
		const defaultIndeterminateIconTag = useIconImport('../../icons/check_indeterminate.svg')

		const rootRef = useElementSync(instance)

		return { instance, defaultIconTag, defaultIndeterminateIconTag, rootRef }
	},
}
</script>

<template>
	<div ref="rootRef" v-if="instance.rendered" v-show="instance.visible" :class="instance.classes">
		<input
			type="checkbox"
			:id="instance.id.toString()"
			:checked="instance.value"
			:name="instance.name"
			:disabled="instance.disabled"
			:required="instance.required"
			:aria-checked="instance.getAriaChecked()"
			@click="instance.readonly ? $event.preventDefault() : null"
			@change="instance.change($event)"
		/>
		<div class="s-check-box__container">
			<!-- Слот для checked иконки -->
			<slot
				v-if="instance.value && !instance.indeterminate"
				name="icon"
				:value="instance.value"
				:indeterminate="instance.indeterminate"
			>
				<Icon :tag="defaultIconTag" :size="instance.size" />
			</slot>
			<!-- Слот для indeterminate иконки -->
			<slot
				v-else-if="instance.indeterminate"
				name="indeterminate-icon"
				:value="instance.value"
				:indeterminate="instance.indeterminate"
			>
				<Icon :tag="defaultIndeterminateIconTag" :size="instance.size" />
			</slot>
		</div>
	</div>
</template>

<style lang="scss">
@use './mixines' as mixines;
@use './../../styles/required' as required;
@reference "./../../../foundation/tailwind";

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

			+ #{$this}__container {
				@apply opacity-s-component-disabled;
			}
		}

		&:focus + #{$this}__container {
			@apply outline-2 outline-offset-2 outline-s-component;
		}
	}

	&__container {
		@apply flex items-center justify-center;
		@apply w-full h-full rounded-md border;
		@apply bg-white;
		@apply transition-colors duration-150;
	}

	&--plain {
		input {
			&:focus + #{$this}__container {
				@apply outline-0;
			}
		}

		#{$this}__container {
			@apply border-0;
			@apply bg-transparent;
		}
	}

	&--required {
		#{$this}__container::after {
			@include required.required-indicator();
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

	&--normal {
		@include mixines.checkbox-variant($this, $color: 'neutral');
	}

	&--accent {
		@include mixines.checkbox-variant($this, $color: 'accent');
	}

	&--positive {
		@include mixines.checkbox-variant($this, $color: 'positive');
	}

	&--negative {
		@include mixines.checkbox-variant($this, $color: 'negative');
	}

	&--caution {
		@include mixines.checkbox-variant($this, $color: 'caution');
	}
}
</style>
