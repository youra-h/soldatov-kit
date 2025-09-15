<script lang="ts">
import { TButton, type IButton } from '../../../core/button'
import { useBaseSetup } from './../../core/useBaseSetup'
import BaseButton, { syncButton } from './base.component'

export default {
	name: '_Button',
	extends: BaseButton,
	setup(props: IButton) {
		const { component } = useBaseSetup(TButton, props)

		syncButton(props, component)

		return {
			component,
		}
	},
}
</script>

<template>
	<component
		:is="component.tag"
		:class="component.classes"
		@click="component.emit('click', $event)"
	>
		<slot name="before"></slot>
		<slot>{{ component.text }}</slot>
		<slot name="after"></slot>
	</component>
</template>

<style>
/* @reference "tailwindcss"; */

.s-button {
	@apply flex items-center justify-center gap-1;
	@apply rounded-md cursor-pointer;
	@apply relative transition-colors duration-200;
	@apply truncate;

	svg {
		fill: currentColor;
	}

	&--primary {
		@apply bg-blue-600 text-white;

		&:hover {
			@apply bg-blue-700;
		}

		&:active {
			@apply bg-blue-800;
		}

		&:disabled {
			@apply bg-blue-300 cursor-not-allowed;
		}
	}
}
</style>
