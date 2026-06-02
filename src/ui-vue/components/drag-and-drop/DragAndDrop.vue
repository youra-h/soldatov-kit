<script lang="ts">
import { TComponentModel, type IComponentModelProps } from '@core'
import BaseDragAndDrop from './base.component'
import { useInstance } from '../../composables/useInstance'
import { useProvideDragContext } from '../../composables/useDragContext'
import type { TBaseComponentModelProps } from '../component-model'

export default {
	name: '_DragAndDrop',
	extends: BaseDragAndDrop,
	setup(props: TBaseComponentModelProps<IComponentModelProps>) {
		const instance = useInstance(TComponentModel, props)

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

.s-drag-and-drop__dragging-item {
	@apply select-none;
	@apply relative rounded-lg;
	@apply isolate;
	@apply shadow-sm;
	@apply #{'!opacity-60'};

	&::after {
		content: '';
		@apply absolute inset-0;
		@apply pointer-events-none;
		@apply rounded-lg;
		@apply opacity-10;
		@apply bg-neutral-100;

		background-image: radial-gradient(currentColor 1px, transparent 1px);
		background-size: 6px 6px;
	}
}
</style>
