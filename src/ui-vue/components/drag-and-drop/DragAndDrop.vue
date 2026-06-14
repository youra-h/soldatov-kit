<script lang="ts">
import { TDragAndDrop, type IDragAndDropProps } from '@core'
import BaseDragAndDrop from './base.component'
import { useInstance } from '../../composables/useInstance'
import { useProvideDragContext } from '../../composables/useDragContext'
import type { TBaseComponentProps } from '../component'

export default {
	name: '_DragAndDrop',
	extends: BaseDragAndDrop,
	setup(props: TBaseComponentProps<IDragAndDropProps>) {
		const instance = useInstance(TDragAndDrop, props)

		useProvideDragContext()

		return { instance }
	},
}
</script>

<template>
	<slot />
</template>

<style lang="scss">
@reference "./../../../foundation/tailwind";

.s-drag-and-drop {
	&__item {
		@apply select-none;
		@apply relative rounded-lg;
		@apply isolate;
		@apply shadow-sm;
		@apply #{'!opacity-70'};

		&::after {
			content: '';
			@apply absolute inset-0;
			@apply pointer-events-none;
			@apply rounded-lg;
			@apply opacity-20;
			@apply bg-neutral-50;

			background-image: radial-gradient(currentColor 1px, transparent 1px);
			background-size: 3px 3px;
		}
	}
}
</style>
