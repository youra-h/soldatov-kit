<script lang="ts">
import { TSkeleton, type ISkeletonProps, type ISkeleton } from '@core'
import { useInstance } from '../../composables/useInstance'
import { useBundle } from '../../composables/useBundle'
import { useElementBinding } from '../../composables/useElementBinding'
import { useInstanceBinding } from '../../composables/useInstanceBinding'
import BaseSkeleton, { syncSkeleton } from './base.component'
import { createComponentViewBundle, TSkeletonStylePlugin } from '@plugins'
import type { TBaseComponentViewProps } from '../component-view'

export default {
	name: '_Skeleton',
	extends: BaseSkeleton,
	setup(props: TBaseComponentViewProps<ISkeletonProps, ISkeleton>, { emit }) {
		const instance = useInstance(TSkeleton, props)
		const plugins = useBundle(createComponentViewBundle, props?.plugins).use(
			TSkeletonStylePlugin,
		)

		const skeletonPlugin = plugins.get(TSkeletonStylePlugin)!

		useInstanceBinding(plugins, instance)
		const rootRef = useElementBinding(plugins)

		const { tag, rendered, visible, present, classes, variant, size, shape, animation } =
			syncSkeleton({
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
			present,
			classes,
			variant,
			size,
			shape,
			animation,
			styles: skeletonPlugin.styles,
		}
	},
}
</script>

<template>
	<component ref="rootRef" :is="tag" :class="classes" :style="styles">
		<div class="s-skeleton__placeholder" v-if="present" />
		<slot />
	</component>
</template>

<style lang="scss">
@use './mixins' as mixins;
@reference './../../../foundation/tailwind';

.s-skeleton {
	$this: &;

	@apply relative block;

	// скрываем всё содержимое slot, пока показывается placeholder
	&:has(.s-skeleton__placeholder) > :not(.s-skeleton__placeholder) {
		@apply opacity-0;
	}

	// size
	&--size-sm {
		@apply w-16 h-4;
	}

	&--size-normal {
		@apply w-20 h-5;
	}

	&--size-lg {
		@apply w-24 h-6;
	}

	&--size-xl {
		@apply w-28 h-7;
	}

	&--size-2xl {
		@apply w-32 h-8;
	}

	&__placeholder {
		@apply absolute inset-0 z-10;

		// shape
		#{$this}--rect & {
			@apply rounded-none;
		}

		#{$this}--rounded & {
			@apply rounded-md;
		}

		#{$this}--circle & {
			@apply rounded-full;
		}

		// animation
		#{$this}--pulse & {
			animation: skeleton-pulse 1.5s ease-in-out infinite;
		}

		#{$this}--wave & {
			@apply overflow-hidden;

			&::after {
				content: '';
				@apply absolute inset-0;
				background: linear-gradient(
					90deg,
					transparent 0%,
					rgba(255, 255, 255, 0.4) 50%,
					transparent 100%
				);
				animation: skeleton-wave 1.5s ease-in-out infinite;
			}
		}

		// variant colors
		#{$this}--normal & {
			@include mixins.skeleton-variant('neutral');
		}

		#{$this}--accent & {
			@include mixins.skeleton-variant('accent');
		}

		#{$this}--positive & {
			@include mixins.skeleton-variant('positive');
		}

		#{$this}--negative & {
			@include mixins.skeleton-variant('negative');
		}

		#{$this}--caution & {
			@include mixins.skeleton-variant('caution');
		}
	}

	@keyframes skeleton-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}

	@keyframes skeleton-wave {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
}
</style>
