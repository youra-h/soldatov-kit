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
.s-drag-and-drop__dragging-item {
	position: relative;
	// isolation: isolate;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		border-radius: inherit;
		opacity: var(--s-drag-overlay-opacity, 0.4);
		background-image: radial-gradient(
			var(--s-drag-overlay-dot-color, currentColor) var(--s-drag-overlay-dot-size, 1px),
			transparent var(--s-drag-overlay-dot-size, 1px)
		);
		background-size: var(--s-drag-overlay-gap, 8px) var(--s-drag-overlay-gap, 8px);
		background-position: center;
	}
}
</style>
